import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AccountType,
  Prisma,
  TransactionType,
  VerificationTokenType,
} from '@prisma/client';
import type { StringValue } from "ms";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';
import { VerificationTokenService } from 'src/verification-token/verification-token.service';
import { AuthTokens, JwtPayload, JwtUser } from './types/jwt.types';

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN: StringValue = "15m";
const REFRESH_TOKEN_EXPIRATION_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRATION_DAYS ?? 30,
);

const DEFAULT_CATEGORIES: Prisma.CategoryCreateWithoutUserInput[] = [
  { name: 'Food & Dining', type: TransactionType.expense, icon: 'food', color: '#F97316' },
  { name: 'Groceries', type: TransactionType.expense, icon: 'groceries', color: '#22C55E' },
  { name: 'Transport', type: TransactionType.expense, icon: 'car', color: '#3B82F6' },
  { name: 'Housing', type: TransactionType.expense, icon: 'rent', color: '#8B5CF6' },
  { name: 'Utilities', type: TransactionType.expense, icon: 'document', color: '#EAB308' },
  { name: 'Health', type: TransactionType.expense, icon: 'medicine', color: '#EF4444' },
  { name: 'Entertainment', type: TransactionType.expense, icon: 'ticket', color: '#EC4899' },
  { name: 'Shopping', type: TransactionType.expense, icon: 'gift', color: '#A855F7' },
  { name: 'Education', type: TransactionType.expense, icon: 'book', color: '#14B8A6' },
  { name: 'Travel', type: TransactionType.expense, icon: 'plane', color: '#06B6D4' },
  { name: 'Subscriptions', type: TransactionType.expense, icon: 'ticket', color: '#64748B' },
  { name: 'Other Expense', type: TransactionType.expense, icon: 'expense', color: '#94A3B8' },
  { name: 'Salary', type: TransactionType.income, icon: 'income', color: '#16A34A' },
  { name: 'Freelance', type: TransactionType.income, icon: 'document', color: '#2563EB' },
  { name: 'Refunds', type: TransactionType.income, icon: 'arrowLeft', color: '#0D9488' },
  { name: 'Investments', type: TransactionType.income, icon: 'savings', color: '#7C3AED' },
  { name: 'Gifts', type: TransactionType.income, icon: 'gift', color: '#DB2777' },
  { name: 'Other Income', type: TransactionType.income, icon: 'plus', color: '#94A3B8' },
];

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private verificationTokenService: VerificationTokenService,
  ) {}

  async register(dto: RegisterDto) {
    const { fullName, email, mobileNumber, dateOfBirth, password } = dto;

    if (!fullName || !email || !password) {
      throw new BadRequestException('fullName, email and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          fullName,
          email: normalizedEmail,
          mobileNumber: mobileNumber ?? null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          password: hashedPassword,
          emailVerifiedAt: null,

          accounts: {
            create: {
              name: 'Cash',
              type: AccountType.cash,
              currencies: ['EUR'],
            },
          },

          categories: {
            create: DEFAULT_CATEGORIES,
          },
        },
      });

      const verificationToken = await this.verificationTokenService.createToken(
        user.id,
        VerificationTokenType.email_verification,
      );

      await this.mailService.sendEmailVerification({
        to: user.email,
        token: verificationToken,
        fullName: user.fullName,
        templateType: 'email_verification',
      });

      return {
        message: 'Account created. Please verify your email.',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const verificationToken = await this.verificationTokenService.verifyToken(
      token,
      VerificationTokenType.email_verification,
    );

    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerifiedAt: new Date() },
    });

    return {
      message: 'Email verified successfully.',
    };
  }

  async verifyEmailChange(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const verificationToken = await this.verificationTokenService.verifyToken(
      token,
      VerificationTokenType.email_change,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: verificationToken.userId },
      select: { id: true, pendingEmail: true },
    });

    if (!user) {
      throw new BadRequestException('User not found for this verification token');
    }

    if (!user.pendingEmail) {
      throw new BadRequestException('There is no pending email change to verify');
    }

    const pendingEmail = user.pendingEmail.trim().toLowerCase();

    const emailOwner = await this.prisma.user.findUnique({
      where: { email: pendingEmail },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== user.id) {
      throw new ConflictException('Email already registered');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: pendingEmail,
        pendingEmail: null,
        emailVerifiedAt: new Date(),
      },
    });

    await this.revokeAllUserRefreshTokens(user.id);

    return {
      message: 'Email changed successfully.',
    };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email.trim().toLowerCase() },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.emailVerifiedAt) {
        const verificationEmailSent =
          await this.resendVerificationEmailIfLastTokenExpired(user.id, user.email);

        throw new UnauthorizedException({
          message: verificationEmailSent
            ? 'Please verify your email before logging in. We sent you a new verification email.'
            : 'Please verify your email before logging in. Check your inbox for the verification email.',
          code: 'EMAIL_NOT_VERIFIED',
          verificationEmailSent,
        });
      }

      return this.generateAuthTokens(user.id, user.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Database error during login');
      }

      throw new InternalServerErrorException('Unexpected error during login');
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenHash = this.hashRefreshToken(refreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
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

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!storedToken.user.emailVerifiedAt) {
      throw new UnauthorizedException('Email is not verified');
    }

    const tokens = await this.generateAuthTokens(
      storedToken.user.id,
      storedToken.user.email,
    );

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revokedAt: new Date(),
        replacedByTokenHash: this.hashRefreshToken(tokens.refreshToken),
      },
    });

    return tokens;
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return { message: 'Logged out successfully' };
    }

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash: this.hashRefreshToken(refreshToken),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.revokeAllUserRefreshTokens(userId);

    return { message: 'Logged out from all sessions successfully' };
  }

  private async resendVerificationEmailIfLastTokenExpired(
    userId: string,
    email: string,
  ) {
    const activeVerificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        userId,
        type: VerificationTokenType.email_verification,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    if (activeVerificationToken) {
      return false;
    }

    const verificationToken = await this.verificationTokenService.createToken(
      userId,
      VerificationTokenType.email_verification,
    );

    await this.mailService.sendEmailVerification({
      to: email,
      token: verificationToken,
      templateType: 'email_verification',
    });

    return true;
  }

  async generateAuthTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email };
    const refreshToken = this.generateRefreshTokenValue();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: this.getRefreshTokenExpiryDate(),
      },
    });

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn:  this.getAccessTokenExpiresIn(),
      }),
      refreshToken,
    };
  }

  async generateToken(userId: string, email: string) {
    const tokens = await this.generateAuthTokens(userId, email);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async sendResetPasswordCode(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // don't reveal if the email exists
    if (!user) {
      return { message: 'If the email exists, a code has been sent' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        resetPasswordCode: hashedCode,
        resetPasswordCodeExpiry: expiry,
      },
    });

    await this.mailService.sendResetPasswordCodeEmail(normalizedEmail, code);

    return {
      message: 'If the email exists, a code has been sent',
    };
  }

  async validateResetPasswordCode(email: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.resetPasswordCode) {
      throw new UnauthorizedException('Invalid code');
    }

    if (!user.resetPasswordCodeExpiry) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    if (user.resetPasswordCodeExpiry < new Date()) {
      throw new UnauthorizedException('Code expired');
    }

    const valid = await bcrypt.compare(code, user.resetPasswordCode);

    if (!valid) {
      throw new UnauthorizedException('Invalid code');
    }

    return { valid };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.resetPasswordCode) {
      throw new UnauthorizedException('Invalid code');
    }

    if (user.resetPasswordCodeExpiry && user.resetPasswordCodeExpiry < new Date()) {
      throw new UnauthorizedException('Code expired');
    }

    const validCode = await bcrypt.compare(code, user.resetPasswordCode);

    if (!validCode) {
      throw new UnauthorizedException('Invalid code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordCodeExpiry: null,
      },
    });

    await this.revokeAllUserRefreshTokens(user.id);

    return {
      message: 'Password updated successfully',
    };
  }

  async checkAccessToken(user: JwtUser) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobileNumber: true,
        dateOfBirth: true,
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException('Invalid access token');
    }

    return {
      valid: true,
      user: dbUser,
    };
  }

  private async revokeAllUserRefreshTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private generateRefreshTokenValue() {
    return randomBytes(64).toString('hex');
  }

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private getRefreshTokenExpiryDate() {
    return new Date(
      Date.now() + REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    );
  }

  private getAccessTokenExpiresIn(): StringValue {
    return (
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN?.trim() ||
      DEFAULT_ACCESS_TOKEN_EXPIRES_IN
    ) as StringValue;
 }
}
