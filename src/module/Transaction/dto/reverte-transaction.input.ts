export class ReverseTransactionInput {
  transactionId: string;
  accountId?: string;
  receiverAccountId?: string;
  reversalReason: string;
}
