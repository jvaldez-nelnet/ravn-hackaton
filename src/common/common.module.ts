import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonService } from './common.service';

@Global()
@Module({
  providers: [PrismaService, CommonService],
  exports: [PrismaService, CommonService],
})
export class CommonModule {}
