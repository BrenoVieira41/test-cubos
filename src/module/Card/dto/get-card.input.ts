import { CardTypeEnum } from "../CardEntity";

export class GetCardInput {
  id?: string;
  number?: string;
  accountId?: string;
}

export interface CardAlreadyExistInput {
  number: string,
  accountId: string,
  type: CardTypeEnum;
  cvv: string;
}
