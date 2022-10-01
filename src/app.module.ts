import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonModule } from './common/common.module';
import { ClockifyModule } from './clockify/clockify.module';

@Module({
  imports: [CommonModule, ClockifyModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
