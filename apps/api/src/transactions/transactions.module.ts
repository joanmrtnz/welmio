import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FinanceModule } from 'src/finance/finance.module';

@Module({
  imports: [PrismaModule, FinanceModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}