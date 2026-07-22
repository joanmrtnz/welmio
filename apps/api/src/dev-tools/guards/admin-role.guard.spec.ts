import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { AdminRoleGuard } from './admin-role.guard';

describe('AdminRoleGuard', () => {
  let guard: AdminRoleGuard;

  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const createContext = (user?: { sub: string }): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as ExecutionContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminRoleGuard, { provide: PrismaService, useValue: prisma }],
    }).compile();

    guard = module.get<AdminRoleGuard>(AdminRoleGuard);
  });

  it('allows admin users', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'ADMIN' });

    await expect(
      guard.canActivate(createContext({ sub: 'user-1' })),
    ).resolves.toBe(true);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { id: true, role: true },
    });
  });

  it('rejects non-admin users', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'USER' });

    await expect(
      guard.canActivate(createContext({ sub: 'user-1' })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects missing authenticated users', async () => {
    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
