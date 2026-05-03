import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FinanceSummaryService } from '../finance/finance-summary.service';
import { CategoriesOverviewResponseDto } from './dto/categories-overview-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeSummaryService: FinanceSummaryService,
  ) {}

  async getCategoriesOverview(
    userId: string,
  ): Promise<CategoriesOverviewResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [summary, categories] = await Promise.all([
      this.financeSummaryService.getUserFinanceSummary(userId),
      this.prisma.category.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          type: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    return {
      summary,
      categories,
    };
  }

  async createCategory(userId: string, createCategoryDto: CreateCategoryDto) {
    const name = createCategoryDto.name.trim();

    try {
      return await this.prisma.category.create({
        data: {
          id: this.buildCategoryId(name),
          userId,
          name,
          type: createCategoryDto.type,
          icon: createCategoryDto.icon,
          color: createCategoryDto.color,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'You already have a category with this name and type.',
        );
      }

      throw error;
    }
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const name = updateCategoryDto.name?.trim();

    try {
      return await this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          ...(name ? { name } : {}),
          ...(updateCategoryDto.type ? { type: updateCategoryDto.type } : {}),
          ...(updateCategoryDto.icon ? { icon: updateCategoryDto.icon } : {}),
          ...(updateCategoryDto.color ? { color: updateCategoryDto.color } : {}),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'You already have a category with this name and type.',
        );
      }

      throw error;
    }
  }

  async deleteCategory(userId: string, categoryId: string) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const transactionsCount = await this.prisma.transaction.count({
      where: {
        userId,
        categoryId,
      },
    });

    if (transactionsCount > 0) {
      throw new ConflictException(
        'You cannot delete a category with existing transactions.',
      );
    }

    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return {
      id: categoryId,
      deleted: true,
    };
  }

  private buildCategoryId(name: string) {
    const normalizedName = name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    return `cat_${normalizedName}_ui`;
  }

}