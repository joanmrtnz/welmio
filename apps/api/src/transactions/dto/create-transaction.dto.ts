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

export const MAX_TRANSACTION_AMOUNT = 9999999999.99;

export class CreateTransactionDto {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  @Max(MAX_TRANSACTION_AMOUNT)
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
  notes?: string | null;

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