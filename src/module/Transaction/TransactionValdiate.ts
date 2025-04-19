import { VALUE_NOT_FOUND } from '../utils/UtilsConstants';
import {
  createError,
  idValidate,
  isFloat,
  validateFields,
  validateIsNull,
  validatePagination,
  valueFormat,
} from '../utils/UtilsService';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionPagination } from './dto/get-transaction.input';
import { ReverseTransactionInput } from './dto/reverte-transaction.input';
import {
  ACCOUNT_ERROR_MESSAGE,
  DESCRIPTION_ERROR_MESSAGE,
  RECEIVER_ERROR_MESSAGE,
  TYPE_ERROR_MESSAGE,
  VALUE_ERROR_MESSAGE,
} from './TransactionConstants';
import { TransactionTypeEnum } from './TransactionEntity';

class TransactionValidate {
  private typeValidate(type: TransactionTypeEnum): string | void {
    if (!type || !(type in TransactionTypeEnum)) return TYPE_ERROR_MESSAGE;
  }

  private descriptionValidate(name: string, typeError: string): string | void {
    if (!name || name.trim().length < 3 || name.length > 200)
      return typeError + DESCRIPTION_ERROR_MESSAGE;
  }

  private valueValidate(value: number | string): string | void {
    value = valueFormat(value);

    if (!Number.isFinite(value)) return VALUE_ERROR_MESSAGE;
  }

  public validateTransaction(data: CreateTransactionInput, internal: boolean = false): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { accountId, description, type, value, receiverAccountId, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      idValidate(accountId, ACCOUNT_ERROR_MESSAGE),
      !internal ? idValidate(receiverAccountId, RECEIVER_ERROR_MESSAGE) : null,
      internal ? this.typeValidate(type) : null,
      this.descriptionValidate(description, 'descrição inválida'),
      this.valueValidate(value),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateTransactionReversal(data: ReverseTransactionInput): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { accountId, transactionId, reversalReason, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      idValidate(accountId, ACCOUNT_ERROR_MESSAGE),
      idValidate(transactionId),
      this.descriptionValidate(reversalReason, 'descrição de estorno inválido'),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateOrder(query: TransactionPagination): void {
    const { accountId, type, currentPage, itemsPerPage, ...rest } = query;

    validateFields(rest);

    const pagination = validatePagination({ currentPage, itemsPerPage });

    const errors: string[] | any = [
      idValidate(accountId, ACCOUNT_ERROR_MESSAGE),
      type ? this.typeValidate(type) : null,
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
    if (pagination) throw createError(pagination, 400);
  }
}

export default TransactionValidate;
