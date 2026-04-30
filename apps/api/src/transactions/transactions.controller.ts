import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt.types';
import { CreateTransactionDto } from './dto/create-transaction.dto';


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

  @Get()
  getUserTransactions(@CurrentUser() user: JwtUser) {
    return this.transactionsService.getUserTransactions(user.sub);
  }

  @Get('overview')
  getUserTransactionsOverview(@CurrentUser() user: JwtUser) {
    return this.transactionsService.getUserTransactionsOverview(user.sub);
  }

}