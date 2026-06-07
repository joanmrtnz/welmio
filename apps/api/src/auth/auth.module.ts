import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { VerificationTokenModule } from 'src/verification-token/verification-token.module';
import type { StringValue } from "ms";


const JWT_ACCESS_TOKEN_EXPIRES_IN = (
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? "15m"
) as StringValue;

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
    MailModule,
    VerificationTokenModule,
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
