import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
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

  @Get(':uuid')
  async getOne(@Param('uuid') uuid) {
    return this.teamMembersService.getOne(uuid);
  }

  @Put(':uuid')
  async updateTeamMember(@Param('uuid') uuid, @Body() teamMember) {
    return this.teamMembersService.updateTeamMember(uuid, teamMember);
  }

  @Delete(':uuid')
  async deleteTeamMember(@Param('uuid') uuid) {
    return this.teamMembersService.deleteTeamMember(uuid);
  }
}
