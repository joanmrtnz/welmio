import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FinanceSummaryService } from '../finance/finance-summary.service';
import { CategoriesOverviewResponseDto } from './dto/categories-overview-response.dto';

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
}