export interface Pagination {
  itemsPerPage?: number | string;
  currentPage?: number | string;
}

export enum OrderEnum {
  asc = 'asc',
  desc = 'desc'
}

export interface PaginationComplement {
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  total: number;
}
