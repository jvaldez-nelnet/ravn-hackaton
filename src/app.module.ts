import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonModule } from './common/common.module';
import { ClockifyModule } from './clockify/clockify.module';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TeamMemberController } from './team-member/team-member.controller';
import { TeamMemberService } from './team-member/team-member.service';

@Module({
  imports: [CommonModule, ClockifyModule, HttpModule],
  controllers: [AppController, UserController, AuthController, TeamMemberController],
  providers: [AppService, UserService, AuthService, TeamMemberService],
})
export class AppModule {}
