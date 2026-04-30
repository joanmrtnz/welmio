import { AccountType } from '@prisma/client';

export class AccountResponseDto {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountsResponseDto {
  accounts: AccountResponseDto[];
}