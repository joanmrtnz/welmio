import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGoalContributionDto {
  @IsOptional()
  @IsString()
  transactionId?: string | null;

  @IsNumber()
  @Min(0.01)
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