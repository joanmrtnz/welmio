import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  FrequencyType,
  TransactionNature,
  TransactionType,
} from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @MaxLength(120)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsDateString()
  date: string;

  @IsString()
  categoryId: string;

  @IsString()
  accountId: string;

  @IsOptional()
  @IsEnum(FrequencyType)
  frequencyType?: FrequencyType;

  @IsOptional()
  @IsEnum(TransactionNature)
  transactionNature?: TransactionNature;
}