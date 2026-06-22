import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VerificationTokenType } from '@prisma/client';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { VerificationTokenService } from './verification-token.service';

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

describe('VerificationTokenService', () => {
  let service: VerificationTokenService;

  const prisma = {
    verificationToken: {
      updateMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const fixedNow = new Date('2026-06-22T12:00:00.000Z');

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(fixedNow);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationTokenService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VerificationTokenService>(VerificationTokenService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createToken', () => {
    it.each([
      {
        type: VerificationTokenType.email_verification,
        expiresAt: new Date('2026-06-23T12:00:00.000Z'),
      },
      {
        type: VerificationTokenType.email_change,
        expiresAt: new Date('2026-06-22T13:00:00.000Z'),
      },
      {
        type: VerificationTokenType.password_reset,
        expiresAt: new Date('2026-06-22T12:15:00.000Z'),
      },
    ])(
      'expires previous active $type tokens and creates a hashed token with the expected expiration',
      async ({ type, expiresAt }) => {
        const token = await service.createToken('user-1', type);

        expect(token).toMatch(/^[a-f0-9]{64}$/);

        expect(prisma.verificationToken.updateMany).toHaveBeenCalledWith({
          where: {
            userId: 'user-1',
            type,
            usedAt: null,
          },
          data: {
            usedAt: fixedNow,
          },
        });

        expect(prisma.verificationToken.create).toHaveBeenCalledWith({
          data: {
            userId: 'user-1',
            type,
            tokenHash: hashToken(token),
            expiresAt,
          },
        });

        const createData = prisma.verificationToken.create.mock.calls[0][0].data;

        expect(createData.tokenHash).not.toBe(token);
        expect(createData).not.toHaveProperty('token');

        expect(
          prisma.verificationToken.updateMany.mock.invocationCallOrder[0],
        ).toBeLessThan(
          prisma.verificationToken.create.mock.invocationCallOrder[0],
        );
      },
    );
  });

  describe('verifyToken', () => {
    it('marks a valid token as used and returns it', async () => {
      const row = {
        id: 'verification-1',
        userId: 'user-1',
        type: VerificationTokenType.email_verification,
        user: {
          id: 'user-1',
          email: 'user@test.com',
        },
      };

      prisma.verificationToken.findFirst.mockResolvedValue(row);

      await expect(
        service.verifyToken(
          'raw-token',
          VerificationTokenType.email_verification,
        ),
      ).resolves.toBe(row);

      expect(prisma.verificationToken.findFirst).toHaveBeenCalledWith({
        where: {
          tokenHash: hashToken('raw-token'),
          type: VerificationTokenType.email_verification,
          usedAt: null,
          expiresAt: {
            gt: fixedNow,
          },
        },
        include: {
          user: true,
        },
      });

      expect(prisma.verificationToken.update).toHaveBeenCalledWith({
        where: {
          id: 'verification-1',
        },
        data: {
          usedAt: fixedNow,
        },
      });
    });

    it('uses the requested token type when verifying tokens', async () => {
      const row = {
        id: 'verification-1',
        userId: 'user-1',
        type: VerificationTokenType.password_reset,
        user: {
          id: 'user-1',
        },
      };

      prisma.verificationToken.findFirst.mockResolvedValue(row);

      await expect(
        service.verifyToken('reset-token', VerificationTokenType.password_reset),
      ).resolves.toBe(row);

      expect(prisma.verificationToken.findFirst).toHaveBeenCalledWith({
        where: {
          tokenHash: hashToken('reset-token'),
          type: VerificationTokenType.password_reset,
          usedAt: null,
          expiresAt: {
            gt: fixedNow,
          },
        },
        include: {
          user: true,
        },
      });
    });

    it('rejects invalid, used or expired tokens', async () => {
      prisma.verificationToken.findFirst.mockResolvedValue(null);

      await expect(
        service.verifyToken('bad-token', VerificationTokenType.password_reset),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.verificationToken.findFirst).toHaveBeenCalledWith({
        where: {
          tokenHash: hashToken('bad-token'),
          type: VerificationTokenType.password_reset,
          usedAt: null,
          expiresAt: {
            gt: fixedNow,
          },
        },
        include: {
          user: true,
        },
      });

      expect(prisma.verificationToken.update).not.toHaveBeenCalled();
    });
  });
});