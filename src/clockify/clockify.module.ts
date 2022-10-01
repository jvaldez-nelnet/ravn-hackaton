import { Module } from '@nestjs/common';
import { ClockifyController } from './clockify.controller';
import { ClockifyService } from './clockify.service';

@Module({
  controllers: [ClockifyController],
  providers: [ClockifyService]
})
export class ClockifyModule {}
