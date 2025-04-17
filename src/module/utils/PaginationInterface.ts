export interface Pagination {
  itemsPerPage?: number | string;
  currentPage?: number | string;
}

export interface Filters {
  [key: string]: any;
}

export enum OrderEnum {
  asc = 'asc',
  desc = 'desc'
}

export interface PaginationComplement {
  itemsPerPage: number;
  currentPage: number;
  total: number;
}
