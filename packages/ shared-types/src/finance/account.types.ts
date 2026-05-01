export type AccountType =
  | 'bank'
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'savings'
  | 'wallet'
  | 'investment';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type AccountsResponse =
  | {
      accounts: Account[];
    }
  | Account[];