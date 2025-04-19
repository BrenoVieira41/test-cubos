import { Pagination } from '../../utils/PaginationInterface';
import { TransactionTypeEnum } from '../TransactionEntity';

export interface TransactionPagination extends Pagination {
  type?: TransactionTypeEnum;
  accountId?: string;
}
