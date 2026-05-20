import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { VerificationTokenModule } from 'src/verification-token/verification-token.module';

@Module({
  imports:[
    MailModule,
    VerificationTokenModule
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}