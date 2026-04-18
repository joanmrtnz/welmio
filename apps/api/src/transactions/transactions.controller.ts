import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface JwtUser {
  sub: string;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getUserTransactions(@CurrentUser() user: JwtUser) {
    return this.transactionsService.getUserTransactions(user.sub);
  }

  @Get('overview')
  getUserTransactionsOverview(@CurrentUser() user: JwtUser) {
    return this.transactionsService.getUserTransactionsOverview(user.sub);
  }
}