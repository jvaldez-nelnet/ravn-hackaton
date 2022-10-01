import { BadRequestException, Injectable } from '@nestjs/common';
import { Country } from '@prisma/client';
import {
  OpenIDConnectTokenResponse,
  UsersListResponse,
  WebClient,
} from '@slack/web-api';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlackService {
  constructor(private prismaService: PrismaService) {}
  getUrl() {
    return `https://slack.com/openid/connect/authorize?scope=openid%20email;response_type=code;redirect_uri=${process.env.REDIRECT_URI};client_id=${process.env.CLIENT_ID}`;
  }

  async importTeamMembers() {
    const client = new WebClient();
    const users = await this.getTeamMembers(process.env.USER_TOKEN);
    const teamMembersFilter = users.members.filter(
      (member) =>
        member.is_bot === false && member.profile.email && !member.deleted,
    );
    const teamMembersCreated = await Promise.all(
      teamMembersFilter.map(async (member) => {
        const userFound = await this.prismaService.teamMember.findFirst({
          where: {
            slackId: member.id,
          },
        });
        if (userFound) return userFound;
        const user = await client.users.profile.get({
          user: member.id,
          token: process.env.USER_TOKEN,
          include_labels: true,
        });
        let country = 'PE';
        if (user.profile.fields) {
          for (const [, value] of Object.entries(user.profile.fields)) {
            if (value.label === 'Country') country = value.value;
          }
        }
        return this.prismaService.teamMember.create({
          data: {
            email: user.profile.email,
            name: user.profile.display_name,
            country: Country[country],
            slackId: member.id,
          },
        });
      }),
    );
    return teamMembersCreated;
  }

  async getOpenIDToken(code: string): Promise<OpenIDConnectTokenResponse> {
    const client = new WebClient();
    try {
      const token = await client.openid.connect.token({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
      });
      return token;
    } catch (error) {
      throw new BadRequestException('Invalid code');
    }
  }

  async getTeamMembers(access_token: string): Promise<UsersListResponse> {
    try {
      const client = new WebClient(access_token);
      const users = await client.users.list({
        include_locale: true,
        include_labels: true,
      });
      return users;
    } catch (e) {
      throw new BadRequestException('invalid or missing access_token');
    }
  }

  async getTeamMemberByEmail(email) {
    const client = new WebClient();
    const user = await client.users.lookupByEmail({
      email: email,
      token: process.env.USER_TOKEN,
      include_labels: true,
    });
    // const user = await client.users.profile.get({
    //   user: userLookup.user.id,
    //   token: process.env.USER_TOKEN,
    //   include_labels: true,
    // });
    return user;
  }

  async sendMessage(userId, message) {
    try {
      const client = new WebClient();
      await client.chat.postMessage({
        channel: userId,
        token: process.env.BOT_TOKEN,
        text: message,
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(`message wasn't send`);
    }
  }
}
