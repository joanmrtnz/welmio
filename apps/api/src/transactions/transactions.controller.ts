import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt.types';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetTransactionsByCategoryQueryDto } from './dto/get-transactions-by-category-query.dto';
import { ImportTransactionsDto } from './dto/import-transactions.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @CurrentUser() user: JwtUser,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(
      user.sub,
      createTransactionDto,
    );
  }

  @Post('import')
  importTransactions(
    @CurrentUser() user: JwtUser,
    @Body() importTransactionsDto: ImportTransactionsDto,
  ) {
    return this.transactionsService.importTransactions(
      user.sub,
      importTransactionsDto.transactions,
    );
  }

  @Put(':id')
  updateTransaction(
    @CurrentUser() user: JwtUser,
    @Param('id') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(
      user.sub,
      transactionId,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  deleteTransaction(
    @CurrentUser() user: JwtUser,
    @Param('id') transactionId: string,
  ) {
    return this.transactionsService.deleteTransaction(user.sub, transactionId);
  }

  @Get('analytics/categories')
  getTransactionsByCategories(
    @CurrentUser() user: JwtUser,
    @Query() query: GetTransactionsByCategoryQueryDto,
  ) {
    return this.transactionsService.getTransactionsByCategories(user.sub, query);
  }

  @Get()
  getUserTransactions(@CurrentUser() user: JwtUser) {
    return this.transactionsService.getUserTransactions(user.sub);
  }

  @Get('overview')
  getUserTransactionsOverview(@CurrentUser() user: JwtUser) {
    return this.transactionsService.getUserTransactionsOverview(user.sub);
  }

}
