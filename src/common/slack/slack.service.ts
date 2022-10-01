import { BadRequestException, Injectable } from '@nestjs/common';
import {
  OpenIDConnectTokenResponse,
  UsersListResponse,
  WebClient,
} from '@slack/web-api';

@Injectable()
export class SlackService {
  getUrl() {
    return `https://slack.com/openid/connect/authorize?scope=openid%20email&amp;response_type=code&amp;redirect_uri=${process.env.REDIRECT_URI}&amp;client_id=${process.env.CLIENT_ID}`;
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
    const client = new WebClient(access_token);
    const users = await client.users.list({ include_locale: true });
    return users;
  }
}
