import { Pagination, PaginationComplement } from './PaginationInterface';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

function isUUID(uuid: string): boolean {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

function isNumeric(value: number | string): boolean {
  const numValue = Number(value);
  return !isNaN(numValue) && isFinite(numValue);
}

function createError(messages: string | string[], status?: number): Error {
  const errorMessage = Array.isArray(messages) ? messages.join('\n') : messages;
  const error = new Error(errorMessage);
  (error as any).status = status ? status : 500;
  return error;
}

function cleanString(value: string): string {
  return value.replace(/[^\d]/g, '');
}

function validateFields(rest: Object): void {
  if (Object.keys(rest).length > 0)
    throw createError(`Campos inválidos: [${Object.keys(rest).join(', ')}]`, 400);
}

function validateIsNull(data: Object): boolean {
  if (!data || Object.keys(data).length === 0) return true;
  return false;
}

function validatePagination(input: Pagination): void {
  const erros: string[] = [];
  const { itemsPerPage, currentPage, ...rest } = input;

  validateFields(rest);

  if (itemsPerPage && !isNumeric(itemsPerPage)) {
    erros.push('Número de itens por página inválido. Deve ser um número inteiro positivo.');
  }

  if (currentPage && !isNumeric(currentPage)) {
    erros.push('Página atual inválida. Deve ser um número inteiro maior ou igual a zero.');
  }

  if (erros.length > 0) {
    throw createError(erros, 400);
  }
}

function setPagination(query: Pagination) {
  const { itemsPerPage, currentPage } = query;
  const pageSize = itemsPerPage ? Number(itemsPerPage) : 10;
  const pageOffset = currentPage ? Math.max(Number(currentPage), 1) : 1;

  return { itemsPerPage: pageSize, currentPage: pageOffset };
}

function paginate(itemsPerPage: number, currentPage: number, total: number): PaginationComplement {
  const totalPages = Math.ceil(total / itemsPerPage);
  const currentPageNumber = currentPage;

  return {
    currentPage: currentPageNumber,
    itemsPerPage: itemsPerPage,
    totalPages,
    total,
  };
}

export {
  isUUID,
  createError,
  cleanString,
  validateFields,
  validateIsNull,
  validatePagination,
  setPagination,
  paginate,
};
