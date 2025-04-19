import { Accounts } from '../Account/AccountEntity';
import { PaginationComplement } from '../utils/PaginationInterface';

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
  receiverAccountId?: string;
  reversalReason?: string;
  createdAt: Date;
  updatedAt: Date;
  reversedAt?: Date;

  accounts: Accounts;
  receiverAccounts?: Accounts;
}

export interface TransactionCreateInterface {
  id: string;
  value: number;
  description: string;
  receiverAccountId?: string;
  createdAt: string;
  updatedAt: string;
  reversedAt?: Date;
}

export interface TransactionOrderInterface {
  transactions: Transactions[],
  pagination: PaginationComplement;
}
