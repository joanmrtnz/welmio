import { Controller, Post, Body, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
   
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Get('verify-email-change')
  verifyEmailChange(@Query('token') token: string) {
    return this.authService.verifyEmailChange(token);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.authService.checkAccessToken(req.user);
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('send-reset-password-code')
  sendResetPasswordCode(@Body('email') email: string) {
    return this.authService.sendResetPasswordCode(email);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('validate-reset-password-code')
  validateResetPasswordCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    return this.authService.validateResetPasswordCode(email, code);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('reset-password')
  resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') password: string,
  ) {
    return this.authService.resetPassword(email, code, password);
  }
}