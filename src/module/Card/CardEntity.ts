import { Accounts } from '../Account/AccountEntity';

export enum CardTypeEnum {
  physical = 'physical',
  virtual = 'virtual',
}

export class Cards {
  id: string;
  type: CardTypeEnum;
  number: string;
  cvv: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;

  account: Accounts;
}
