import { Users } from '../User/UserEntity';
import { Cards } from '../Card/CardEntity';
import { Transactions } from '../Transaction/TransactionEntity';

export class Accounts {
  id: string;
  branch: string;
  account: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  user: Users;
  Cards?: Cards[];
  transactions: Transactions[];
  received: Transactions[];
}
