import { Pagination } from '../../utils/PaginationInterface';
import { CardTypeEnum } from '../CardEntity';

export class GetCardInput {
  id?: string;
  number?: string;
  accountId?: string;
}

export interface CardAlreadyExistInput {
  number: string;
  accountId: string;
  type: CardTypeEnum;
  cvv: string;
}

export interface TransactionPagination extends Pagination {
  type?: CardTypeEnum;
}
