import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { VerificationTokenType } from '@prisma/client';
import { VerificationTokenService } from 'src/verification-token/verification-token.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly verificationTokenService: VerificationTokenService,
    private readonly mailService: MailService,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
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
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserProfile(userId: string, dto: UpdateUserProfileDto) {
    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const requestedEmail = dto.email?.trim().toLowerCase();
    const shouldVerifyNewEmail =
      Boolean(requestedEmail) && requestedEmail !== currentUser.email.toLowerCase();

    if (shouldVerifyNewEmail && requestedEmail) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: requestedEmail,
        },
        select: {
          id: true,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already registered');
      }
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: dto.fullName,
        mobileNumber: dto.mobileNumber,
        avatarIcon: dto.avatarIcon,
        avatarColor: dto.avatarColor,
        pendingEmail: shouldVerifyNewEmail ? requestedEmail : undefined,
      },
      select: {
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
      },
    });

    if (shouldVerifyNewEmail && requestedEmail) {
      // fix: the token its expirated
      const verificationToken = await this.verificationTokenService.createToken(
        user.id,
        VerificationTokenType.email_change,
      );

      await this.mailService.sendEmailVerification({
        to: requestedEmail,
        token: verificationToken,
        fullName: user.fullName,
        templateType: 'email_change'
      });
    }

    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!validCurrentPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordCodeExpiry: null,
      },
    });

    return {
      message: 'Password updated successfully',
    };
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    if (dto.confirmationText.trim().toLowerCase() !== "delete") {
      throw new BadRequestException("Invalid confirmation text");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      id: userId,
      deleted: true,
      message: "Account deleted successfully",
    };
  }
}