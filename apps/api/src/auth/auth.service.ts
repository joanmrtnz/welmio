import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountType, Prisma, TransactionType, VerificationTokenType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';
import { VerificationTokenService } from 'src/verification-token/verification-token.service';

const DEFAULT_CATEGORIES: Prisma.CategoryCreateWithoutUserInput[] = [
  {
    name: 'Food & Dining',
    type: TransactionType.expense,
    icon: 'food',
    color: '#F97316',
  },
  {
    name: 'Groceries',
    type: TransactionType.expense,
    icon: 'groceries',
    color: '#22C55E',
  },
  {
    name: 'Transport',
    type: TransactionType.expense,
    icon: 'car',
    color: '#3B82F6',
  },
  {
    name: 'Housing',
    type: TransactionType.expense,
    icon: 'rent',
    color: '#8B5CF6',
  },
  {
    name: 'Utilities',
    type: TransactionType.expense,
    icon: 'document',
    color: '#EAB308',
  },
  {
    name: 'Health',
    type: TransactionType.expense,
    icon: 'medicine',
    color: '#EF4444',
  },
  {
    name: 'Entertainment',
    type: TransactionType.expense,
    icon: 'ticket',
    color: '#EC4899',
  },
  {
    name: 'Shopping',
    type: TransactionType.expense,
    icon: 'gift',
    color: '#A855F7',
  },
  {
    name: 'Education',
    type: TransactionType.expense,
    icon: 'book',
    color: '#14B8A6',
  },
  {
    name: 'Travel',
    type: TransactionType.expense,
    icon: 'plane',
    color: '#06B6D4',
  },
  {
    name: 'Subscriptions',
    type: TransactionType.expense,
    icon: 'ticket',
    color: '#64748B',
  },
  {
    name: 'Other Expense',
    type: TransactionType.expense,
    icon: 'expense',
    color: '#94A3B8',
  },
  {
    name: 'Salary',
    type: TransactionType.income,
    icon: 'income',
    color: '#16A34A',
  },
  {
    name: 'Freelance',
    type: TransactionType.income,
    icon: 'document',
    color: '#2563EB',
  },
  {
    name: 'Refunds',
    type: TransactionType.income,
    icon: 'arrowLeft',
    color: '#0D9488',
  },
  {
    name: 'Investments',
    type: TransactionType.income,
    icon: 'savings',
    color: '#7C3AED',
  },
  {
    name: 'Gifts',
    type: TransactionType.income,
    icon: 'gift',
    color: '#DB2777',
  },
  {
    name: 'Other Income',
    type: TransactionType.income,
    icon: 'plus',
    color: '#94A3B8',
  },
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
      throw new BadRequestException(
        'fullName, email and password are required',
      );
    }

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          fullName,
          email,
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
    const verificationToken = await this.verificationTokenService.verifyToken(
      token,
      VerificationTokenType.email_verification,
    );

    await this.prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        emailVerifiedAt: new Date(),
      },
    });

    return {
      message: 'Email verified successfully.',
    };
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.emailVerifiedAt) {
        throw new UnauthorizedException('Please verify your email before logging in');
      }

      const passwordMatch = await bcrypt.compare(
        dto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.generateToken(user.id, user.email);

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          'Database error during login',
        );
      }

      throw new InternalServerErrorException(
        'Unexpected error during login',
      );
    }
  }

  async generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async sendResetPasswordCode(email: string) {

  if (!email) {
    throw new BadRequestException('Email is required');
  }

  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  // don't reveal if the email exist
  if (!user) {
    return { message: 'If the email exists, a code has been sent' };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = await bcrypt.hash(code, 10);
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await this.prisma.user.update({
    where: { email },
    data: {
      resetPasswordCode: hashedCode,
      resetPasswordCodeExpiry: expiry,
    },
  });


  await this.mailService.sendResetPasswordCodeEmail(email, code);


  return {
    message: 'If the email exists, a code has been sent',
  };
}

async validateResetPasswordCode(email: string, code: string) {

  const user = await this.prisma.user.findUnique({
    where: { email },
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

  const valid = await bcrypt.compare(
    code,
    user.resetPasswordCode,
  );

  if (!valid) {
    throw new UnauthorizedException('Invalid code');
  }

  return {
    valid,
  };
}

async resetPassword(
  email: string,
  code: string,
  newPassword: string,
) {

  if (!newPassword || newPassword.length < 6) {
    throw new BadRequestException('Password must be at least 6 characters');
  }

  const user = await this.prisma.user.findUnique({
    where: { email },
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
    where: { email },
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

async checkAccessToken(user: { sub: string; email: string }) {
  const dbUser = await this.prisma.user.findUnique({
    where: {
      id: user.sub,
    },
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

}