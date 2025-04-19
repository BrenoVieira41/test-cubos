import { CardTypeEnum } from '../CardEntity';

export class CreateCardInput {
  type: CardTypeEnum;
  number: string;
  cvv: string;
  accountId: string;
}
