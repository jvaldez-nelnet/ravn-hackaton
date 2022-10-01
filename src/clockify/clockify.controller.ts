import { Body, Controller, Post } from '@nestjs/common';

@Controller('clockify')
export class ClockifyController {
  @Post('/approvals')
  async receiveApprovals(@Body() body: any) {
    console.log(body);
  }
}
