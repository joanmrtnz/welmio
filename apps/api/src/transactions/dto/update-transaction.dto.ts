import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  FrequencyType,
  TransactionNature,
  TransactionType,
} from '@prisma/client';
import { MAX_TRANSACTION_AMOUNT } from './create-transaction.dto';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  @Max(MAX_TRANSACTION_AMOUNT)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string | null;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsEnum(FrequencyType)
  frequencyType?: FrequencyType;

  @IsOptional()
  @IsEnum(TransactionNature)
  transactionNature?: TransactionNature;
}