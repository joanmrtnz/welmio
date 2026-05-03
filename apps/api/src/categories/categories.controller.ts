import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';
import type { JwtUser } from 'src/auth/types/jwt.types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('overview')
  getCategoriesOverview(@CurrentUser() user: JwtUser) {
    return this.categoriesService.getCategoriesOverview(user.sub);
  }

  @Post()
  createCategory(
    @CurrentUser() user: JwtUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.createCategory(user.sub, createCategoryDto);
  }

  @Put(':id')
  updateCategory(
    @CurrentUser() user: JwtUser,
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(
      user.sub,
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  deleteCategory(
    @CurrentUser() user: JwtUser,
    @Param('id') categoryId: string,
  ) {
    return this.categoriesService.deleteCategory(user.sub, categoryId);
  }
}