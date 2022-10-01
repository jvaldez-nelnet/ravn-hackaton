import { Body, Controller, Post } from '@nestjs/common';
import { ClockifyService } from './clockify.service';
import { ClockifyApprovalDto } from './dto/clockify-approval.dto';

@Controller('clockify')
export class ClockifyController {
  constructor(private clockifyService: ClockifyService) {}
  @Post('/approvals')
  async receiveApprovals(@Body() body: ClockifyApprovalDto) {
    return this.clockifyService.receiveApproval(body);
  }
}
