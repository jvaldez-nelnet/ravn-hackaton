import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private commonService: CommonService,
  ) {}

  getAll = async () => {
    const dataSend = {
      dateRangeStart: '2022-09-01T00:00:00.000',
      dateRangeEnd: '2022-09-30T23:59:59.000',
      summaryFilter: {
        groups: ['USER'],
      },
      users: {
        ids: ['628284f9b2256c219900e07d'],
        contains: 'CONTAINS',
        status: 'ALL',
      },
    };
    const config = {
      method: 'post',
      url: 'https://reports.api.clockify.me/v1/workspaces/624c9b11631e200dd1947881/reports/summary',
      headers: {
        'X-Api-Key': 'NjVlYTlhMjktZWEwMi00ZjhjLTg2MTktYTk0ZDEyMmY5Yzlk',
        'Content-Type': 'application/json',
      },
      data: dataSend,
    };

    const report = await this.httpService
      .post(config.url, dataSend, {
        headers: {
          'X-Api-Key': process.env.XAPIKEY,
        },
      })
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
    const users = await this.prismaService.user.findMany();
    return users;
  };
}
