import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ClockifyController } from './clockify.controller';
import { ClockifyService } from './clockify.service';

@Module({
  imports: [HttpModule, CommonModule],
  controllers: [ClockifyController],
  providers: [ClockifyService],
})
export class ClockifyModule {}
