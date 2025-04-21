import {
  createError,
  idValidate,
  validateFields,
  validateIsNull,
  validatePagination,
} from '../utils/UtilsService';
import { ACCOUNT_ID_ERROR_MESSAGE, CVV_ERROR_MESSAGE, NUMBER_ERROR_MESSAGE, TYPE_ERROR_MESSAGE } from './CardConstants';
import { CardTypeEnum } from './CardEntity';
import { CreateCardInput } from './dto/create-card.input';
import { GetCardInput, TransactionPagination } from './dto/get-card.input';
import { VALUE_NOT_FOUND } from '../utils/UtilsConstants';


class CardValidate {
  public typeValidate(type: CardTypeEnum): string | void {
    if (!type || !(type in CardTypeEnum)) return TYPE_ERROR_MESSAGE;
  }

  private cvvValidate(cvv: string): string | void {
    const cvvRegex = RegExp(/^\d{3}$/);

    if (!cvv || !cvvRegex.test(cvv)) return CVV_ERROR_MESSAGE;
  }

  private validateCardNumber(cardNumber: string): string | void {
    if (!cardNumber) return NUMBER_ERROR_MESSAGE;
    const cardNumberRegex = RegExp(/^\d{16}$/);

    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cardNumberRegex.test(cleaned)) return NUMBER_ERROR_MESSAGE;
  }

  public validateCreateCard(data: CreateCardInput): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { type, number, cvv, accountId, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      this.typeValidate(type),
      idValidate(accountId, ACCOUNT_ID_ERROR_MESSAGE),
      this.cvvValidate(cvv),
      this.validateCardNumber(number),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateGetCard(data: GetCardInput): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { id, number, accountId, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      id ? idValidate(id) : null,
      number ? this.validateCardNumber(number) : null,
      accountId ? idValidate(accountId, ACCOUNT_ID_ERROR_MESSAGE) : null,
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateOrder(query: TransactionPagination): void {
    const { type, currentPage, itemsPerPage, ...rest } = query;

    validateFields(rest);

    const errors: string[] | any = [
      validatePagination({ currentPage, itemsPerPage }),
      type ? this.typeValidate(type) : null,
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }
}

export default CardValidate;
