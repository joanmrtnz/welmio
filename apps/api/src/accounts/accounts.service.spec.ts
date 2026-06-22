import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AccountsService', () => {
  let service: AccountsService;
  const prisma = {
    account: {
      findMany: jest.fn(),
    },
  };

  const expectedFindManyArgs = {
    where: { userId: 'user-1' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      type: true,
      currencies: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('returns the current user accounts ordered by creation date', async () => {
    const accounts = [
      {
        id: 'account-1',
        name: 'Cash',
        type: 'cash',
        currencies: ['EUR'],
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ];
    prisma.account.findMany.mockResolvedValue(accounts);

    await expect(service.getAccountsByUser('user-1')).resolves.toEqual({
      accounts,
    });

    expect(prisma.account.findMany).toHaveBeenCalledWith(expectedFindManyArgs);
  });

  it('returns an empty accounts array when the user has no accounts', async () => {
    prisma.account.findMany.mockResolvedValue([]);

    await expect(service.getAccountsByUser('user-1')).resolves.toEqual({
      accounts: [],
    });

    expect(prisma.account.findMany).toHaveBeenCalledWith(expectedFindManyArgs);
  });
});