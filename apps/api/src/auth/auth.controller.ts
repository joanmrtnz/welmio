import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    console.log("API: setting new registration...");
    return this.authService.register(dto);
   
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  getMe(@Req() req) {
    return req.user;
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