import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MAX_GOAL_AMOUNT } from './create-goal.dto';

export class CreateGoalContributionDto {
  @IsOptional()
  @IsString()
  transactionId?: string | null;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  @Max(MAX_GOAL_AMOUNT)
  amount: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string | null;
}