import { Pagination } from '../../utils/PaginationInterface';

export class GetUserInput {
  id?: string;
  document?: string;
}

export interface UsersPagination extends Pagination {
  name?: string;
  document?: string;
}
