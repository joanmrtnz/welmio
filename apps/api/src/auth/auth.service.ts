import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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

        accounts: {
          create: {
            name: 'Cash',
            type: 'cash',
            currencies: ['EUR'],
          },
        },
      },
    });

    return this.generateToken(user.id, user.email);
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

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
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

}