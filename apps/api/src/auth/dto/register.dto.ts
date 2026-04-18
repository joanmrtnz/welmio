import { RegisterInput } from '@repo/shared-types';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto implements RegisterInput {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  mobileNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  @MinLength(6)
  password: string;
}