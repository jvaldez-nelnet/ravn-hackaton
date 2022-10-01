import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClockifyApprovalDto } from './dto/clockify-approval.dto';

@Injectable()
export class ClockifyService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private commonService: CommonService,
  ) {}

  receiveApproval = async (clockifyApproval: ClockifyApprovalDto) => {
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
          groups: ['USER'],
        },
        exportType: 'JSON',
        users: {
          ids: [clockifyApproval.owner.userId],
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
      const totalTime = totals[0].totalTime;
      const invoiceTotal = Math.round((totalTime / 3600) * 100) / 100;
      const convertedTime = this.commonService.convertTime(totalTime);
      console.log(
        `the invoice total is: ${invoiceTotal} and the converted time is ${convertedTime}`,
      );
    }
    // console.log(clockifyApproval);
  };
}
