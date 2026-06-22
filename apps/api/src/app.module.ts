import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AccountsModule } from './accounts/accounts.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { GoalsModule } from './goals/goals.module';
import { GoalsService } from './goals/goals.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { VerificationTokenModule } from './verification-token/verification-token.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        RESEND_API_KEY: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        APP_URL: Joi.string().uri().required(),
        CORS_ORIGIN: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60,
      },
    ]),
    AuthModule,
    PrismaModule,
    TransactionsModule,
    CategoriesModule,
    AnalyticsModule,
    AccountsModule,
    UsersModule,
    GoalsModule,
    VerificationTokenModule,
  ],
  providers: [
    GoalsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
