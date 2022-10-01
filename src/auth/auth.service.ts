import { Injectable } from '@nestjs/common';
import { SlackService } from 'src/common/slack/slack.service';

@Injectable()
export class AuthService {
  constructor(private slackService: SlackService) {}
  getUrl() {
    return this.slackService.getUrl();
  }

  getOpenIdToken(code) {
    return this.slackService.getOpenIDToken(code);
  }
}
