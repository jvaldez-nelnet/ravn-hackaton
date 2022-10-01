import { Body, Controller, Post } from '@nestjs/common';
import { ClockifyApprovalDto } from './dto/clockify-approval.dto';

@Controller('clockify')
export class ClockifyController {
  @Post('/approvals')
  async receiveApprovals(@Body() body: ClockifyApprovalDto) {
    console.log(body);
  }
}
