import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import type { JwtUser } from 'src/auth/types/jwt.types';

type AuthenticatedRequest = Request & {
  user?: JwtUser;
};

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.sub;

    if (!userId) {
      throw new ForbiddenException('Authenticated user is required.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Dev tools are only available for admins.');
    }

    return true;
  }
}
