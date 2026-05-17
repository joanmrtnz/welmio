import { Controller, Post, Body, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
   
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.authService.checkAccessToken(req.user);
  }

  @Post('send-reset-password-code')
  sendResetPasswordCode(@Body('email') email: string) {
    return this.authService.sendResetPasswordCode(email);
  }

  @Post('validate-reset-password-code')
  validateResetPasswordCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    return this.authService.validateResetPasswordCode(email, code);
  }

  @Post('reset-password')
  resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') password: string,
  ) {
    return this.authService.resetPassword(email, code, password);
  }
}