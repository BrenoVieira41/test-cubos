import { TransactionTypeEnum } from '../TransactionEntity';

export class CreateTransactionInput {
  value: number;
  description: string;
  type: TransactionTypeEnum;
  accountId?: string;
  receiverAccountId?: string;
}
