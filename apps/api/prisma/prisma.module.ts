import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 muy importante
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}