import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsPeriodDto } from './dto/analytics-period.dto';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analysisService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Req() req: any, @Query() query: AnalyticsPeriodDto) {
    return this.analysisService.getSummary(req.user.id, query.period);
  }
}