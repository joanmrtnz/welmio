import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FinanceSummaryService } from './finance-summary.service';

@Module({
  imports: [PrismaModule],
  providers: [FinanceSummaryService],
  exports: [FinanceSummaryService],
})
export class FinanceModule {}