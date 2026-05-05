import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt.types';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}


  @Delete(':id')
  deleteGoal(
    @CurrentUser() user: JwtUser,
    @Param('id') goalId: string,
  ) {
    return this.goalsService.deleteGoal(user.sub, goalId);
  }

  @Post()
  createGoal(
    @CurrentUser() user: JwtUser,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.createGoal(user.sub, createGoalDto);
  }

  @Patch(':id')
  updateGoal(
    @CurrentUser() user: JwtUser,
    @Param('id') goalId: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.updateGoal(user.sub, goalId, updateGoalDto);
  }

  @Get('overview')
  getUserGoalsOverview(@CurrentUser() user: JwtUser) {
    return this.goalsService.getUserGoalsOverview(user.sub);
  }

  @Get(':id/contributions')
  getGoalContributions(
    @CurrentUser() user: JwtUser,
    @Param('id') goalId: string,
  ) {
    return this.goalsService.getGoalContributions(user.sub, goalId);
  }
}