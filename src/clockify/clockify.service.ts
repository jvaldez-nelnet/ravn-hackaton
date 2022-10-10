import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SlackService } from 'src/common/slack/slack.service';
import { ClockifyApprovalDto } from './dto/clockify-approval.dto';
import * as moment from 'moment';

@Injectable()
export class ClockifyService {
  constructor(
    private httpService: HttpService,
    private commonService: CommonService,
    private slackService: SlackService,
    private prismaService: PrismaService,
  ) {}

  receiveApproval = async (clockifyApproval: ClockifyApprovalDto) => {
    const baseURL = 'https://reports.api.clockify.me/v1';
    if (clockifyApproval.status.state === 'APPROVED') {
      // verify the date the approvals was made
      const approvalDate = moment(clockifyApproval.status.updatedAt);
      // const firstDayApproval = moment(approvalDate).startOf('month');
      // const forthDayApproval = moment(firstDayApproval).add(4, 'days');
      // if (!approvalDate.isBetween(firstDayApproval, forthDayApproval)) {
      // is not the first approval
      // return;
      // }

      // match with the corresponding user if exists in the database
      const user = await this.prismaService.teamMember.findUnique({
        where: {
          email: clockifyApproval.creator.userEmail,
        },
      });

      if (!user) {
        console.error(
          `there is no user with email ${clockifyApproval.creator.userEmail}`,
        );
        return;
      }

      if (user && !user.clockifyId) {
        await this.prismaService.teamMember.update({
          where: {
            id: user.id,
          },
          data: {
            clockifyId: clockifyApproval.creator.userId,
            status: 'APPROVED',
          },
        });
      }

      const date = moment(approvalDate).subtract(1, 'month');
      const startDate = date.startOf('month').toISOString();
      const endDate = date.endOf('month').toISOString();
      const monthName = date.locale('es').format('MMMM').toUpperCase();

      const options = {
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        summaryFilter: {
          groups: ['MONTH'],
        },
        exportType: 'JSON',
        users: {
          ids: [clockifyApproval.creator.userId],
          contains: 'CONTAINS',
          status: 'ALL',
        },
      };

      const report = await this.httpService
        .post(
          baseURL +
            `/workspaces/${clockifyApproval.workspaceId}/reports/summary`,
          options,
          {
            headers: {
              'X-Api-Key': process.env.XAPIKEY,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();
      const {
        data: { totals },
      } = report;
      if (!totals) {
        console.error(`the user entries doesn't match for the month`);
        throw new BadRequestException();
      }
      const totalTime = totals[0].totalTime; // time in miliseconds
      const totalHours = Math.round((totalTime / 3600) * 100) / 100;
      const convertedTime = this.commonService.convertTime(totalTime);
      const convertedTimeTemplate =
        this.commonService.convertTimeTemplate(totalTime);
      const templateVariables = {
        TOTAL_HOURS: totalHours,
        TOTAL_TIME: convertedTime,
        MONTH: monthName,
        WAGE: user.wage,
        INVOICE_TOTAL: totalHours * user.wage,
        REIMBURSEMENT: 20,
      };
      await this.prismaService.teamMember.update({
        where: {
          id: user.id,
        },
        data: {
          totalTime: convertedTimeTemplate,
        },
      });
      let template = `the invoice total is: {{TOTAL_HOURS}} and the converted time is {{TOTAL_TIME}}`;
      const prismaTemplate = await this.prismaService.template.findFirst({
        where: {
          location: user.country,
        },
      });
      if (template) {
        template = prismaTemplate.template;
      }

      for (const [key, value] of Object.entries(templateVariables)) {
        template = template.replace(`{{${key}}}`, value as string);
      }

      await this.slackService.sendMessage(user.slackId, template);
      await this.slackService.sendMessage(
        user.slackId,
        `Your total invoice is: ${templateVariables.INVOICE_TOTAL}`,
      );
      return template;
    } else if (clockifyApproval.status.state === 'PENDING') {
      // update the approval state for the teamMember
      const approvalDate = moment(clockifyApproval.status.updatedAt);
      const firstDayApproval = moment(approvalDate).startOf('month');
      const forthDayApproval = moment(firstDayApproval).add(4, 'days');
      if (!approvalDate.isBetween(firstDayApproval, forthDayApproval)) {
        // is not the first approval
        return;
      }
      const teamMember = await this.prismaService.teamMember.update({
        where: {
          email: clockifyApproval.creator.userEmail,
        },
        data: {
          clockifyId: clockifyApproval.creator.userId,
          status: 'PENDING',
        },
      });
      if (!teamMember) {
        console.error(
          `there is no user with email ${clockifyApproval.creator.userEmail}`,
        );
        return;
      }
    }
  };
}
