import { TransactionTypeEnum } from '../TransactionEntity';

export class CreateCardInput {
  value: string;
  description: string;
  type: TransactionTypeEnum;
  accountId: string;
  receiverAccountId: string;
}
