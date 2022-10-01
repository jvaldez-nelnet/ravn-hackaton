import { Body, Controller, Get, Post } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private templateService: TemplateService) {}
  @Post()
  async createTemplate(@Body() template) {
    return this.templateService.createTemplate(template);
  }

  @Get()
  async getAll() {
    return this.templateService.getAll();
  }
}
