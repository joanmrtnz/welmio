import {
  IsDateString,
  IsEnum,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { GoalType } from '@prisma/client';

export const MAX_GOAL_AMOUNT = 9999999999.99;

export class CreateGoalDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  @Max(MAX_GOAL_AMOUNT)
  targetAmount: number;

  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Max(MAX_GOAL_AMOUNT)
  currentAmount?: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string | null;

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsEnum(GoalType)
  type: GoalType;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string | null;

  @IsOptional()
  @IsHexColor()
  @MaxLength(20)
  color?: string | null;
}