import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('url')
  async getUrl() {
    return this.authService.getUrl();
  }

  @Get('redirect')
  async getToken(@Param() code) {
    return this.authService.getOpenIdToken(code);
  }
}
