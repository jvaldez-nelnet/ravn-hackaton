import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TemplateService {
  constructor(private prismaService: PrismaService) {}
  createTemplate = async (template) => {
    return this.prismaService.template.create({ data: template });
  };

  modifyTemplate = async (template, uuid) => {
    return this.prismaService.template.update({
      where: {
        uuid,
      },
      data: {
        ...template,
      },
    });
  };

  deleteTemplate(uuid) {
    return this.prismaService.template.delete({ where: { uuid } });
  }

  getOne(uuid) {
    return this.prismaService.template.findUnique({ where: { uuid } });
  }

  getAll = async () => {
    return this.prismaService.template.findMany();
  };

  getTemplateVariables = async () => {
    return {
      TOTAL_HOURS: '{{TOTAL_HOURS}}',
      TOTAL_TIME: '{{TOTAL_TIME}}',
      MONTH: '{{MONTH}}',
      WAGE: '{{WAGE}}',
      INVOICE_TOTAL: '{{INVOICE_TOTAL}}',
      REIMBURSEMENT: '{{REIMBURSEMENT}}',
    };
  };
}
