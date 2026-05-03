import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  // TODO: allow change email with new email verification
  async updateUserProfile(userId: string, dto: UpdateUserProfileDto) {
  const user = await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fullName: dto.fullName,
      mobileNumber: dto.mobileNumber,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      mobileNumber: true,
      dateOfBirth: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
}