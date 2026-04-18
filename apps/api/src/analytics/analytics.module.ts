import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FinanceModule } from 'src/finance/finance.module';

@Module({
  imports: [PrismaModule, FinanceModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}