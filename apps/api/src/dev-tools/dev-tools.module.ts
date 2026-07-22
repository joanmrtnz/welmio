import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DevToolsController } from './dev-tools.controller';
import { DevToolsService } from './dev-tools.service';
import { AdminRoleGuard } from './guards/admin-role.guard';

@Module({
  imports: [PrismaModule],
  controllers: [DevToolsController],
  providers: [DevToolsService, AdminRoleGuard],
})
export class DevToolsModule {}
