import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AccountType,
  Prisma,
  TransactionType,
  VerificationTokenType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { VerificationTokenService } from '../verification-token/verification-token.service';
import { AuthService } from './auth.service';

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

describe('AuthService', () => {
  let service: AuthService;

  const prisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    verificationToken: {
      findFirst: jest.fn(),
    },
  };

  const jwtService = {
    signAsync: jest.fn(),
  };

  const mailService = {
    sendEmailVerification: jest.fn(),
    sendResetPasswordCodeEmail: jest.fn(),
  };

  const verificationTokenService = {
    createToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  const verifiedUser = {
    id: 'user-1',
    email: 'user@test.com',
    password: '',
    emailVerifiedAt: new Date('2026-06-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useRealTimers();

    jwtService.signAsync.mockResolvedValue('access-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: MailService, useValue: mailService },
        {
          provide: VerificationTokenService,
          useValue: verificationTokenService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('registers a user with normalized email, default account/categories and verification email', async () => {
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@test.com',
        fullName: 'New User',
      });
      verificationTokenService.createToken.mockResolvedValue('verify-token');

      await expect(
        service.register({
          fullName: 'New User',
          email: '  New@Test.com ',
          password: 'secret1',
        }),
      ).resolves.toEqual({
        message: 'Account created. Please verify your email.',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          fullName: 'New User',
          email: 'new@test.com',
          mobileNumber: null,
          dateOfBirth: null,
          password: expect.any(String),
          emailVerifiedAt: null,
          accounts: {
            create: {
              name: 'Cash',
              type: AccountType.cash,
              currencies: ['EUR'],
            },
          },
          categories: {
            create: expect.arrayContaining([
              expect.objectContaining({
                name: 'Food & Dining',
                type: TransactionType.expense,
              }),
              expect.objectContaining({
                name: 'Salary',
                type: TransactionType.income,
              }),
            ]),
          },
        }),
      });

      const createdPassword = prisma.user.create.mock.calls[0][0].data.password;
      await expect(bcrypt.compare('secret1', createdPassword)).resolves.toBe(
        true,
      );

      expect(verificationTokenService.createToken).toHaveBeenCalledWith(
        'user-1',
        VerificationTokenType.email_verification,
      );
      expect(mailService.sendEmailVerification).toHaveBeenCalledWith({
        to: 'new@test.com',
        token: 'verify-token',
        fullName: 'New User',
        templateType: 'email_verification',
      });
    });

    it('stores optional registration fields when provided', async () => {
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@test.com',
        fullName: 'New User',
      });
      verificationTokenService.createToken.mockResolvedValue('verify-token');

      await service.register({
        fullName: 'New User',
        email: 'new@test.com',
        mobileNumber: '+34600000000',
        dateOfBirth: '1998-05-10',
        password: 'secret1',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          mobileNumber: '+34600000000',
          dateOfBirth: new Date('1998-05-10'),
        }),
      });
    });

    it('rejects incomplete registration data before writing', async () => {
      await expect(
        service.register({
          fullName: '',
          email: 'new@test.com',
          password: 'secret1',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('rejects short registration passwords before writing', async () => {
      await expect(
        service.register({
          fullName: 'New User',
          email: 'new@test.com',
          password: '12345',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('throws conflict when email is already registered', async () => {
      const duplicateEmailError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: 'test-client-version',
        },
      );

      prisma.user.create.mockRejectedValue(duplicateEmailError);

      await expect(
        service.register({
          fullName: 'New User',
          email: 'existing@test.com',
          password: 'secret1',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(verificationTokenService.createToken).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('verifies an email token and marks the user email as verified', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      verificationTokenService.verifyToken.mockResolvedValue({
        userId: 'user-1',
      });

      await expect(service.verifyEmail('verify-token')).resolves.toEqual({
        message: 'Email verified successfully.',
      });

      expect(verificationTokenService.verifyToken).toHaveBeenCalledWith(
        'verify-token',
        VerificationTokenType.email_verification,
      );
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { emailVerifiedAt: new Date('2026-06-22T12:00:00.000Z') },
      });
    });

    it('rejects missing email verification tokens', async () => {
      await expect(service.verifyEmail('')).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(verificationTokenService.verifyToken).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmailChange', () => {
    it('verifies a pending email change, normalizes the email and revokes sessions', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      verificationTokenService.verifyToken.mockResolvedValue({
        userId: 'user-1',
      });
      prisma.user.findUnique
        .mockResolvedValueOnce({
          id: 'user-1',
          pendingEmail: '  New@Test.com ',
        })
        .mockResolvedValueOnce(null);

      await expect(
        service.verifyEmailChange('change-token'),
      ).resolves.toEqual({
        message: 'Email changed successfully.',
      });

      expect(verificationTokenService.verifyToken).toHaveBeenCalledWith(
        'change-token',
        VerificationTokenType.email_change,
      );
      expect(prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: 'user-1' },
        select: { id: true, pendingEmail: true },
      });
      expect(prisma.user.findUnique).toHaveBeenNthCalledWith(2, {
        where: { email: 'new@test.com' },
        select: { id: true },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          email: 'new@test.com',
          pendingEmail: null,
          emailVerifiedAt: new Date('2026-06-22T12:00:00.000Z'),
        },
      });
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: new Date('2026-06-22T12:00:00.000Z') },
      });
    });

    it('rejects missing email change tokens', async () => {
      await expect(service.verifyEmailChange('')).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(verificationTokenService.verifyToken).not.toHaveBeenCalled();
    });

    it('rejects email change when the token user no longer exists', async () => {
      verificationTokenService.verifyToken.mockResolvedValue({
        userId: 'user-1',
      });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyEmailChange('change-token'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('rejects email change when there is no pending email', async () => {
      verificationTokenService.verifyToken.mockResolvedValue({
        userId: 'user-1',
      });
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        pendingEmail: null,
      });

      await expect(
        service.verifyEmailChange('change-token'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('rejects email change when the pending email belongs to another user', async () => {
      verificationTokenService.verifyToken.mockResolvedValue({
        userId: 'user-1',
      });
      prisma.user.findUnique
        .mockResolvedValueOnce({
          id: 'user-1',
          pendingEmail: 'taken@test.com',
        })
        .mockResolvedValueOnce({ id: 'user-2' });

      await expect(
        service.verifyEmailChange('change-token'),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('logs in a verified user and stores a hashed refresh token', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...verifiedUser,
        password: await bcrypt.hash('secret1', 10),
      });

      const result = await service.login({
        email: ' USER@Test.com ',
        password: 'secret1',
      });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toHaveLength(128);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      });
      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          tokenHash: hashToken(result.refreshToken),
          expiresAt: expect.any(Date),
        }),
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: 'user-1', email: 'user@test.com' },
        {
          secret: process.env.JWT_SECRET,
          expiresIn:
            process.env.JWT_ACCESS_TOKEN_EXPIRES_IN?.trim() || '15m',
        },
      );
    });

    it('rejects login when the user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'missing@test.com', password: 'secret1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
    });

    it('rejects login when the password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...verifiedUser,
        password: await bcrypt.hash('secret1', 10),
      });

      await expect(
        service.login({ email: 'user@test.com', password: 'wrong-password' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
    });

    it('rejects unverified login and resends verification email only when no active token exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...verifiedUser,
        password: await bcrypt.hash('secret1', 10),
        emailVerifiedAt: null,
      });
      prisma.verificationToken.findFirst.mockResolvedValue(null);
      verificationTokenService.createToken.mockResolvedValue('verify-token');

      await expect(
        service.login({ email: 'user@test.com', password: 'secret1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.verificationToken.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          type: VerificationTokenType.email_verification,
          usedAt: null,
          expiresAt: { gt: expect.any(Date) },
        },
        select: { id: true },
      });
      expect(verificationTokenService.createToken).toHaveBeenCalledWith(
        'user-1',
        VerificationTokenType.email_verification,
      );
      expect(mailService.sendEmailVerification).toHaveBeenCalledWith({
        to: 'user@test.com',
        token: 'verify-token',
        templateType: 'email_verification',
      });
    });

    it('rejects unverified login without resending when an active token already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...verifiedUser,
        password: await bcrypt.hash('secret1', 10),
        emailVerifiedAt: null,
      });
      prisma.verificationToken.findFirst.mockResolvedValue({
        id: 'active-token-1',
      });

      await expect(
        service.login({ email: 'user@test.com', password: 'secret1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(verificationTokenService.createToken).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('wraps Prisma login errors as internal server errors', async () => {
      const databaseError = new Prisma.PrismaClientKnownRequestError(
        'Database error',
        {
          code: 'P2024',
          clientVersion: 'test-client-version',
        },
      );

      prisma.user.findUnique.mockRejectedValue(databaseError);

      await expect(
        service.login({ email: 'user@test.com', password: 'secret1' }),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('refresh', () => {
    it('rotates valid refresh tokens and revokes the previous one', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'refresh-1',
        revokedAt: null,
        expiresAt: new Date('2026-06-23T12:00:00.000Z'),
        user: {
          id: 'user-1',
          email: 'user@test.com',
          emailVerifiedAt: new Date('2026-06-01T00:00:00.000Z'),
        },
      });

      const result = await service.refresh('raw-refresh-token');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: expect.any(String),
      });

      expect(prisma.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: hashToken('raw-refresh-token') },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              emailVerifiedAt: true,
            },
          },
        },
      });

      expect(prisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'refresh-1' },
        data: {
          revokedAt: new Date('2026-06-22T12:00:00.000Z'),
          replacedByTokenHash: hashToken(result.refreshToken),
        },
      });
    });

    it('rejects missing refresh tokens', async () => {
      await expect(service.refresh('')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(prisma.refreshToken.findUnique).not.toHaveBeenCalled();
    });

    it('rejects unknown refresh tokens', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(
        service.refresh('raw-refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      expect(prisma.refreshToken.update).not.toHaveBeenCalled();
    });

    it('rejects revoked refresh tokens', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'refresh-1',
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
        user: {
          id: 'user-1',
          email: 'user@test.com',
          emailVerifiedAt: new Date(),
        },
      });

      await expect(
        service.refresh('raw-refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      expect(prisma.refreshToken.update).not.toHaveBeenCalled();
    });

    it('rejects expired refresh tokens', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'refresh-1',
        revokedAt: null,
        expiresAt: new Date('2026-06-22T11:59:59.999Z'),
        user: {
          id: 'user-1',
          email: 'user@test.com',
          emailVerifiedAt: new Date(),
        },
      });

      await expect(
        service.refresh('raw-refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      expect(prisma.refreshToken.update).not.toHaveBeenCalled();
    });

    it('rejects refresh tokens for unverified users', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'refresh-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        user: {
          id: 'user-1',
          email: 'user@test.com',
          emailVerifiedAt: null,
        },
      });

      await expect(
        service.refresh('raw-refresh-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      expect(prisma.refreshToken.update).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('returns success without writing when no refresh token is provided', async () => {
      await expect(service.logout()).resolves.toEqual({
        message: 'Logged out successfully',
      });

      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('revokes the provided refresh token hash', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      await expect(service.logout('raw-refresh-token')).resolves.toEqual({
        message: 'Logged out successfully',
      });

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          tokenHash: hashToken('raw-refresh-token'),
          revokedAt: null,
        },
        data: {
          revokedAt: new Date('2026-06-22T12:00:00.000Z'),
        },
      });
    });
  });

  describe('logoutAll', () => {
    it('revokes all active user refresh tokens', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      await expect(service.logoutAll('user-1')).resolves.toEqual({
        message: 'Logged out from all sessions successfully',
      });

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: new Date('2026-06-22T12:00:00.000Z') },
      });
    });
  });

  describe('sendResetPasswordCode', () => {
    it('rejects missing reset password email before reading users', async () => {
      await expect(service.sendResetPasswordCode('')).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('does not reveal whether a reset password email exists', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.sendResetPasswordCode('missing@test.com'),
      ).resolves.toEqual({
        message: 'If the email exists, a code has been sent',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'missing@test.com' },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(mailService.sendResetPasswordCodeEmail).not.toHaveBeenCalled();
    });

    it('stores a hashed reset code, expiry and sends the raw code by email', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));
      jest.spyOn(Math, 'random').mockReturnValue(0);

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
      });

      await expect(
        service.sendResetPasswordCode(' USER@Test.com '),
      ).resolves.toEqual({
        message: 'If the email exists, a code has been sent',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
        data: {
          resetPasswordCode: expect.any(String),
          resetPasswordCodeExpiry: new Date('2026-06-29T12:00:00.000Z'),
        },
      });

      const hashedCode = prisma.user.update.mock.calls[0][0].data
        .resetPasswordCode;
      await expect(bcrypt.compare('100000', hashedCode)).resolves.toBe(true);

      expect(mailService.sendResetPasswordCodeEmail).toHaveBeenCalledWith(
        'user@test.com',
        '100000',
      );
    });
  });

  describe('validateResetPasswordCode', () => {
    it('validates a reset password code', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: new Date(Date.now() + 60_000),
      });

      await expect(
        service.validateResetPasswordCode(' USER@Test.com ', '123456'),
      ).resolves.toEqual({ valid: true });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      });
    });

    it('rejects validation when the user or reset code is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validateResetPasswordCode('missing@test.com', '123456'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects validation when reset code expiry is missing', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: null,
      });

      await expect(
        service.validateResetPasswordCode('user@test.com', '123456'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects expired reset codes', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: new Date('2026-06-22T11:59:59.999Z'),
      });

      await expect(
        service.validateResetPasswordCode('user@test.com', '123456'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects invalid reset codes', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: new Date(Date.now() + 60_000),
      });

      await expect(
        service.validateResetPasswordCode('user@test.com', '000000'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('validates reset codes before clearing them and revoking sessions', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: new Date('2026-06-22T12:01:00.000Z'),
      });

      await expect(
        service.resetPassword('USER@test.com', '123456', 'new-secret'),
      ).resolves.toEqual({ message: 'Password updated successfully' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
        data: expect.objectContaining({
          password: expect.any(String),
          resetPasswordCode: null,
          resetPasswordCodeExpiry: null,
        }),
      });

      const updatedPassword = prisma.user.update.mock.calls[0][0].data.password;
      await expect(
        bcrypt.compare('new-secret', updatedPassword),
      ).resolves.toBe(true);

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: new Date('2026-06-22T12:00:00.000Z') },
      });
    });

    it('rejects short new passwords before reading users', async () => {
      await expect(
        service.resetPassword('user@test.com', '123456', '12345'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('rejects reset when user or reset code is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword('missing@test.com', '123456', 'new-secret'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('rejects expired reset codes', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: new Date('2026-06-22T11:59:59.999Z'),
      });

      await expect(
        service.resetPassword('user@test.com', '123456', 'new-secret'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('rejects invalid reset codes', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        resetPasswordCode: await bcrypt.hash('123456', 10),
        resetPasswordCodeExpiry: new Date(Date.now() + 60_000),
      });

      await expect(
        service.resetPassword('user@test.com', '000000', 'new-secret'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('checkAccessToken', () => {
    it('returns the database user for a valid access token payload', async () => {
      const dbUser = {
        id: 'user-1',
        email: 'user@test.com',
        fullName: 'User One',
        mobileNumber: null,
        dateOfBirth: null,
      };

      prisma.user.findUnique.mockResolvedValue(dbUser);

      await expect(
        service.checkAccessToken({ sub: 'user-1', email: 'user@test.com' }),
      ).resolves.toEqual({
        valid: true,
        user: dbUser,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
          fullName: true,
          mobileNumber: true,
          dateOfBirth: true,
        },
      });
    });

    it('rejects access token payloads for missing users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.checkAccessToken({
          sub: 'missing-user',
          email: 'user@test.com',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('generateToken', () => {
    it('returns only an access token while still creating a refresh token internally', async () => {
      await expect(
        service.generateToken('user-1', 'user@test.com'),
      ).resolves.toEqual({
        accessToken: 'access-token',
      });

      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          tokenHash: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: 'user-1', email: 'user@test.com' },
        {
          secret: process.env.JWT_SECRET,
          expiresIn:
            process.env.JWT_ACCESS_TOKEN_EXPIRES_IN?.trim() || '15m',
        },
      );
    });
  });
});