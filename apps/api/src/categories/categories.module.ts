import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FinanceModule } from 'src/finance/finance.module';

@Module({
  imports: [PrismaModule, FinanceModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}