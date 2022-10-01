import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email) {
    return this.userService.getByUserEmail(email);
  }

  @Get('slack')
  getSlackUsers(@Query('access_token') access_token) {
    return this.userService.getSlackUsers(access_token);
  }

  @Post('message')
  sendMessage(@Body() body) {
    return this.userService.sendMessageToUser(body);
  }
}
