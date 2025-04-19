import { Accounts } from '../Account/AccountEntity';
import { PaginationComplement } from '../utils/PaginationInterface';

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

export interface CardOrderInterface {
  cards: Cards[];
  pagination: PaginationComplement;
}
