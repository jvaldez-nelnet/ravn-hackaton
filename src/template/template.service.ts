import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TemplateService {
  constructor(private prismaService: PrismaService) {}
  createTemplate = async (template) => {
    return this.prismaService.template.create({ data: template });
  };

  getAll = async () => {
    return this.prismaService.template.findMany();
  };
}
