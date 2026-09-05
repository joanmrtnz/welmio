import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export const MAX_TRANSACTIONS_PER_IMPORT = 500;

export class ImportTransactionsDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_TRANSACTIONS_PER_IMPORT)
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  transactions: CreateTransactionDto[];
}
