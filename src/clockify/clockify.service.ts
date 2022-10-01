import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SlackService } from 'src/common/slack/slack.service';
import { ClockifyApprovalDto } from './dto/clockify-approval.dto';

@Injectable()
export class ClockifyService {
  constructor(
    private httpService: HttpService,
    private commonService: CommonService,
    private slackService: SlackService,
    private prismaService: PrismaService,
  ) {}

  receiveApproval = async (clockifyApproval: ClockifyApprovalDto) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const baseURL = 'https://reports.api.clockify.me/v1';
    if (clockifyApproval.status.state === 'APPROVED') {
      // verify the date the approvals was made
      const date = new Date(clockifyApproval.status.updatedAt);
      date.setMonth(date.getMonth() - 1);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const startDate = firstDay.toISOString().split('T')[0] + 'T00:00:00.000';
      const endDate = lastDay.toISOString().split('T')[0] + 'T23:59:59.000';
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
          },
        });
      }

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
      const totalTime = totals[0].totalTime;
      const totalHours = Math.round((totalTime / 3600) * 100) / 100;
      const convertedTime = this.commonService.convertTime(totalTime);
      const currentMonth = monthNames[date.getMonth()];
      const wage = 5;
      const templateVariables = {
        TOTAL_HOURS: totalHours,
        TOTAL_TIME: convertedTime,
        MONTH: currentMonth,
        WAGE: wage,
        invoiceTotal: totalHours * wage,
      };
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
        template.replace(`{{${key}}}`, value as string);
      }

      // const result = `the invoice total is: ${totalHours} and the converted time is ${convertedTime}`;
      await this.slackService.sendMessage(user.slackId, template);
      console.log(template);
      return template;
    }
    // console.log(clockifyApproval);
  };
}
