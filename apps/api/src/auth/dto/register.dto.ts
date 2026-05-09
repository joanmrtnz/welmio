import { RegisterInput } from '@repo/shared-types';
import { Transform } from 'class-transformer';
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

  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional()
  @IsString()
  @MinLength(6)
  mobileNumber?: string;

  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  @MinLength(6)
  password: string;
}