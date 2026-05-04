import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt.types';
import { CreateGoalDto } from './dto/create-goal.dto';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  createGoal(
    @CurrentUser() user: JwtUser,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.createGoal(user.sub, createGoalDto);
  }

  @Get('overview')
  getUserGoalsOverview(@CurrentUser() user: JwtUser) {
    return this.goalsService.getUserGoalsOverview(user.sub);
  }
}