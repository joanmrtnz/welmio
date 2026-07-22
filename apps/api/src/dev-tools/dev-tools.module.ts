import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DevToolsController } from './dev-tools.controller';
import { DevToolsService } from './dev-tools.service';

@Module({
  imports: [PrismaModule],
  controllers: [DevToolsController],
  providers: [DevToolsService],
})
export class DevToolsModule {}
