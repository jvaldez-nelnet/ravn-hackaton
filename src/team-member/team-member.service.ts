import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SlackService } from 'src/common/slack/slack.service';

@Injectable()
export class TeamMemberService {
  constructor(
    private slackService: SlackService,
    private prismaService: PrismaService,
  ) {}

  importTeamMembers = async () => {
    return this.slackService.importTeamMembers();
  };

  getAll = async () => {
    return this.prismaService.teamMember.findMany();
  };
}
