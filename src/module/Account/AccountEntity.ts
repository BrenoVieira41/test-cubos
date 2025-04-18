import { Users } from '../User/UserEntity';
// import { Transactions } from '../Transaction/';
// import { Cards } from '../Card/';

export class Accounts {
  id: string;
  branch: string;
  account: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  users: Users;
  // Cards?: Cards;
  // transactions: Transactions[];
  // received: Transactions[];
}
