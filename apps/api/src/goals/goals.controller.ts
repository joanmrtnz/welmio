import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt.types';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('overview')
  getUserGoalsOverview(@CurrentUser() user: JwtUser) {
    return this.goalsService.getUserGoalsOverview(user.sub);
  }
}