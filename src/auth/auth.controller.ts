import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('url')
  async getUrl() {
    return this.authService.getUrl();
  }

  @Get('redirect')
  async getToken(@Query('code') code) {
    return this.authService.getOpenIdToken(code);
  }
}
