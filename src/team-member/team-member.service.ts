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

  updateTeamMember = async (uuid, teamMember) => {
    return this.prismaService.teamMember.update({
      where: {
        uuid,
      },
      data: {
        ...teamMember,
      },
    });
  };

  deleteTeamMember = async (uuid) => {
    return this.prismaService.teamMember.delete({
      where: {
        uuid,
      },
    });
  };

  getOne = async (uuid) => {
    return this.prismaService.teamMember.findUnique({
      where: {
        uuid,
      },
    });
  };
}
