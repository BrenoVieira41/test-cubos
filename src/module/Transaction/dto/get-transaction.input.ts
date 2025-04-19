import { Pagination } from '../../utils/PaginationInterface';

export class GetTransactionInput {
  id?: string;
  type?: string;
  accountId?: string;
  receiverAccountId?: string;
}

export interface TransactionPagination extends Pagination {
  type?: string;
  accountId?: string;
  receiverAccountId?: string;
}
