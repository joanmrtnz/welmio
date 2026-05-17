import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, VerificationTokenType } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';

const VERIFICATION_TOKEN_EXPIRATION_MINUTES: Record<
  VerificationTokenType,
  number
> = {
  email_verification: 60 * 24,
  email_change: 60,
  password_reset: 15,
};

@Injectable()
export class VerificationTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: string, type: VerificationTokenType) {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);

    const expiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRATION_MINUTES[type] * 60 * 1000,
    );

    await this.prisma.verificationToken.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await this.prisma.verificationToken.create({
      data: {
        userId,
        type,
        tokenHash,
        expiresAt,
      },
    });

    return token;
  }

  async verifyToken(token: string, type: VerificationTokenType) {
    const tokenHash = this.hashToken(token);

    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        tokenHash,
        type,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.verificationToken.update({
      where: {
        id: verificationToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    return verificationToken;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}