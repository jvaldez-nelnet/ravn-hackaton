import { Controller, Get } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';

@Controller('team-member')
export class TeamMemberController {
  constructor(private teamMembersService: TeamMemberService) {}
  @Get('import')
  async importTeamMembers() {
    return this.teamMembersService.importTeamMembers();
  }

  @Get()
  async getAll() {
    return this.teamMembersService.getAll();
  }
}
