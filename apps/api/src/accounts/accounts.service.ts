import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccountsByUser(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        type: true,
        currencies: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      accounts,
    };
  }
}