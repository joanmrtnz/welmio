import type { IconName } from '@repo/shared-types';
import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  mobileNumber?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  avatarIcon?: IconName;

  @IsOptional()
  @IsHexColor()
  avatarColor?: string | null;
}