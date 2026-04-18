import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserTransactionsOverviewParamsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}