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

@Module({
  imports: [AuthModule, PrismaModule, TransactionsModule, CategoriesModule, AnalyticsModule, AccountsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
