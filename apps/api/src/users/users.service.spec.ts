import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VerificationTokenType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { VerificationTokenService } from '../verification-token/verification-token.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const verificationTokenService = {
    createToken: jest.fn(),
  };

  const mailService = {
    sendEmailVerification: jest.fn(),
  };

  const expectedProfileSelect = {
    id: true,
    fullName: true,
    email: true,
    mobileNumber: true,
    dateOfBirth: true,
    role: true,
    avatarIcon: true,
    avatarColor: true,
    createdAt: true,
    updatedAt: true,
  };

  const expectedCurrentUserSelect = {
    id: true,
    fullName: true,
    email: true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: VerificationTokenService,
          useValue: verificationTokenService,
        },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('getUserProfile', () => {
    it('returns the public profile for an existing user without selecting sensitive fields', async () => {
      const profile = {
        id: 'user-1',
        email: 'u@test.com',
        fullName: 'User',
        mobileNumber: null,
        dateOfBirth: null,
        role: 'user',
        avatarIcon: null,
        avatarColor: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-02T00:00:00.000Z'),
      };

      prisma.user.findUnique.mockResolvedValue(profile);

      await expect(service.getUserProfile('user-1')).resolves.toBe(profile);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        select: expectedProfileSelect,
      });
    });

    it('rejects profile lookup for missing users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserProfile('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'missing',
        },
        select: expectedProfileSelect,
      });
    });
  });

  describe('updateUserProfile', () => {
    it('updates profile fields without email verification when email is not changed', async () => {
      const updatedUser = {
        id: 'user-1',
        email: 'old@test.com',
        fullName: 'Updated User',
        mobileNumber: '+34600000000',
        dateOfBirth: null,
        role: 'user',
        avatarIcon: 'money',
        avatarColor: '#111827',
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-02T00:00:00.000Z'),
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'old@test.com',
        fullName: 'User One',
      });
      prisma.user.update.mockResolvedValue(updatedUser);

      await expect(
        service.updateUserProfile('user-1', {
          fullName: 'Updated User',
          mobileNumber: '+34600000000',
          avatarIcon: 'money',
          avatarColor: '#111827',
        }),
      ).resolves.toBe(updatedUser);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        select: expectedCurrentUserSelect,
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        data: {
          fullName: 'Updated User',
          mobileNumber: '+34600000000',
          avatarIcon: 'money',
          avatarColor: '#111827',
          pendingEmail: undefined,
        },
        select: expectedProfileSelect,
      });

      expect(verificationTokenService.createToken).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('does not trigger email verification when the requested email only changes casing or spaces', async () => {
      const updatedUser = {
        id: 'user-1',
        email: 'old@test.com',
        fullName: 'User One',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'old@test.com',
        fullName: 'User One',
      });
      prisma.user.update.mockResolvedValue(updatedUser);

      await expect(
        service.updateUserProfile('user-1', {
          email: '  OLD@Test.com  ',
          fullName: 'User One',
        }),
      ).resolves.toBe(updatedUser);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        data: {
          fullName: 'User One',
          mobileNumber: undefined,
          avatarIcon: undefined,
          avatarColor: undefined,
          pendingEmail: undefined,
        },
        select: expectedProfileSelect,
      });

      expect(verificationTokenService.createToken).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('stores pending email and sends an email-change verification when email changes', async () => {
      const updatedUser = {
        id: 'user-1',
        email: 'old@test.com',
        fullName: 'User One',
        mobileNumber: null,
        dateOfBirth: null,
        role: 'user',
        avatarIcon: null,
        avatarColor: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-02T00:00:00.000Z'),
      };

      prisma.user.findUnique
        .mockResolvedValueOnce({
          id: 'user-1',
          email: 'old@test.com',
          fullName: 'User One',
        })
        .mockResolvedValueOnce(null);
      prisma.user.update.mockResolvedValue(updatedUser);
      verificationTokenService.createToken.mockResolvedValue('token-1');

      await expect(
        service.updateUserProfile('user-1', {
          email: '  New@Test.com ',
          fullName: 'User One',
        }),
      ).resolves.toBe(updatedUser);

      expect(prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: {
          id: 'user-1',
        },
        select: expectedCurrentUserSelect,
      });

      expect(prisma.user.findUnique).toHaveBeenNthCalledWith(2, {
        where: {
          email: 'new@test.com',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        data: {
          fullName: 'User One',
          mobileNumber: undefined,
          avatarIcon: undefined,
          avatarColor: undefined,
          pendingEmail: 'new@test.com',
        },
        select: expectedProfileSelect,
      });

      expect(verificationTokenService.createToken).toHaveBeenCalledWith(
        'user-1',
        VerificationTokenType.email_change,
      );

      expect(mailService.sendEmailVerification).toHaveBeenCalledWith({
        to: 'new@test.com',
        token: 'token-1',
        fullName: 'User One',
        templateType: 'email_change',
      });
    });

    it('rejects profile updates for missing users and does not write', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserProfile('missing', {
          fullName: 'Updated User',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'missing',
        },
        select: expectedCurrentUserSelect,
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(verificationTokenService.createToken).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('does not allow changing to another user email and does not write or send email', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({
          id: 'user-1',
          email: 'old@test.com',
          fullName: 'User One',
        })
        .mockResolvedValueOnce({
          id: 'user-2',
        });

      await expect(
        service.updateUserProfile('user-1', {
          email: ' taken@Test.com ',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.user.findUnique).toHaveBeenNthCalledWith(2, {
        where: {
          email: 'taken@test.com',
        },
        select: {
          id: true,
        },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(verificationTokenService.createToken).not.toHaveBeenCalled();
      expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('changes password only when the current password is valid', async () => {
      const currentHash = await bcrypt.hash('old-password', 10);

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        password: currentHash,
      });
      prisma.user.update.mockResolvedValue({});

      await expect(
        service.changePassword('user-1', {
          currentPassword: 'old-password',
          newPassword: 'new-password',
        }),
      ).resolves.toEqual({
        message: 'Password updated successfully',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        select: {
          id: true,
          password: true,
        },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        data: {
          password: expect.any(String),
          resetPasswordCode: null,
          resetPasswordCodeExpiry: null,
        },
      });

      const updatedPassword = prisma.user.update.mock.calls[0][0].data.password;
      await expect(
        bcrypt.compare('new-password', updatedPassword),
      ).resolves.toBe(true);
    });

    it('rejects short new passwords before reading the user', async () => {
      await expect(
        service.changePassword('user-1', {
          currentPassword: 'old-password',
          newPassword: '12345',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('rejects password changes when the new password matches the current password before reading the user', async () => {
      await expect(
        service.changePassword('user-1', {
          currentPassword: 'same-password',
          newPassword: 'same-password',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('rejects password changes for missing users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('missing', {
          currentPassword: 'old-password',
          newPassword: 'new-password',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'missing',
        },
        select: {
          id: true,
          password: true,
        },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('rejects password changes when the current password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        password: await bcrypt.hash('old-password', 10),
      });

      await expect(
        service.changePassword('user-1', {
          currentPassword: 'wrong-password',
          newPassword: 'new-password',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('deletes an account when the confirmation text is valid after trimming and normalizing case', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
      });
      prisma.user.delete.mockResolvedValue({
        id: 'user-1',
      });

      await expect(
        service.deleteAccount('user-1', {
          confirmationText: ' DELETE ',
        }),
      ).resolves.toEqual({
        id: 'user-1',
        deleted: true,
        message: 'Account deleted successfully',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
      });
    });

    it('rejects invalid confirmation text before reading the user', async () => {
      await expect(
        service.deleteAccount('user-1', {
          confirmationText: 'nope',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('rejects account deletion for missing users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteAccount('missing', {
          confirmationText: 'delete',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'missing',
        },
        select: {
          id: true,
        },
      });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});