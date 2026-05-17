import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { GoalsService } from './goals/goals.service';
import { GoalsModule } from './goals/goals.module';
import { VerificationTokenModule } from './verification-token/verification-token.module';

@Module({
  imports: [AuthModule, PrismaModule, TransactionsModule, CategoriesModule, AnalyticsModule, AccountsModule, UsersModule, GoalsModule, VerificationTokenModule],
  controllers: [AppController],
  providers: [AppService, GoalsService],
})
export class AppModule {}
