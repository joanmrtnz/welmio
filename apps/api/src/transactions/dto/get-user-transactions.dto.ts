import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserTransactionsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}