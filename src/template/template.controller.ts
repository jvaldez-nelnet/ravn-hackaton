import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private templateService: TemplateService) {}
  @Post()
  async createTemplate(@Body() template) {
    return this.templateService.createTemplate(template);
  }

  @Put(':uuid')
  async updateTemplate(@Body() template, @Param('uuid') uuid) {
    return this.templateService.modifyTemplate(template, uuid);
  }

  @Delete(':uuid')
  async deleteTemplate(@Param('uuid') uuid) {
    return this.templateService.deleteTemplate(uuid);
  }

  @Get(':uuid')
  async getOne(@Param('uuid') uuid) {
    return this.templateService.getOne(uuid);
  }

  @Get()
  async getAll() {
    return this.templateService.getAll();
  }

  @Get('variables')
  async getVariables() {
    return this.templateService.getTemplateVariables();
  }
}
