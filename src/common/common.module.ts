import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommonService } from './common.service';
import { SlackService } from './slack/slack.service';

@Global()
@Module({
  providers: [PrismaService, CommonService, SlackService],
  exports: [PrismaService, CommonService, SlackService],
})
export class CommonModule {}
