import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';
import type { JwtUser } from 'src/auth/types/jwt.types';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('overview')
  getCategoriesOverview(@CurrentUser() user: JwtUser) {
    return this.categoriesService.getCategoriesOverview(user.sub);
  }
}