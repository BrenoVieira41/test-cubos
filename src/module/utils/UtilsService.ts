import { PERMISSION_ERROR_MESSAGE } from '../User/UserConstants';
import { UserRoleEnum } from '../User/UserEntity';
import { Pagination, PaginationComplement } from './PaginationInterface';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

function isUUID(uuid: string): boolean {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

function valueFormat(input: number | string): number {
  return typeof input === 'string' ? parseFloat(input) : input;
}

function isFloat(value: number | string): boolean {
  const numValue = Number(value);
  return !isNaN(numValue) && isFinite(numValue) && numValue % 1 !== 0;
}

function isNumeric(value: number | string): boolean {
  const numValue = Number(value);
  return !isNaN(numValue) && isFinite(numValue);
}

function idValidate(id: string, message?: string ) {
  const errorMessage = message ? message : 'Id inválido.';
  if (!isUUID(id)) return errorMessage;
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

function validatePagination(input: Pagination): void | string {
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

function validateUserIsAdmin(role: UserRoleEnum) {
  if (role !== UserRoleEnum.admin) throw createError(PERMISSION_ERROR_MESSAGE, 403);
}

function setPagination(query: Pagination) {
  const { itemsPerPage, currentPage } = query;

  const pageSize = itemsPerPage ? Number(itemsPerPage) : 10;
  const pageOffset = currentPage ? Math.max(Number(currentPage), 1) : 1;
  const skip = (pageOffset - 1) * pageSize;

  return { skip, take: pageSize };
}


function paginate(itemsPerPage: number, currentPage: number): PaginationComplement {
  const pageSize = itemsPerPage > 0 ? itemsPerPage : 10;
  const page = currentPage > 0 ? currentPage : 1;

  return {
    currentPage: page,
    itemsPerPage: pageSize,
  };
}

export {
  isUUID,
  valueFormat,
  isFloat,
  idValidate,
  createError,
  cleanString,
  validateFields,
  validateIsNull,
  validateUserIsAdmin,
  validatePagination,
  setPagination,
  paginate,
};
