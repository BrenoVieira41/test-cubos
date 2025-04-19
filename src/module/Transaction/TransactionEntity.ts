import { Accounts } from '../Account/AccountEntity';

export enum TransactionTypeEnum {
  credit = 'credit',
  debit = 'debit',
}

export class Transactions {
  id: string;
  value: number;
  description: string;
  type: TransactionTypeEnum;
  accountId: string;
  receiverAccountId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  accounts: Accounts;
  receiverAccounts?: Accounts | null;
}
