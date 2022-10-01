import { Body, Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('url')
  async getUrl() {
    return this.authService.getUrl();
  }

  @Redirect(process.env.FRONTEND_URL, 301)
  @Get('redirect')
  async getToken(@Query('code') code) {
    return {
      url: `${process.env.FRONTEND_URL}?code=${code}`,
    };
  }

  @Get('open-id')
  async getOpenIdToken(@Body() body) {
    return this.authService.getOpenIdToken(body.code);
  }
}
