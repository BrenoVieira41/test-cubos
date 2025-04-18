import { createError, isUUID, validateFields, validateIsNull } from '../utils/UtilsService';
import {
  ACCOUNT_ERROR_MESSAGE,
  BRANCH_ERROR_MESSAGE,
  ID_ERROR_MESSAGE,
  VALUE_NOT_FOUND,
} from './AccountConstants';
import { CreateAccountInput } from './dto/create-account.input';
import { GetAccountInput } from './dto/get-account.input';

class AccountValidate {
  public idValidate(id: string): string | void {
    if (!isUUID(id)) return ID_ERROR_MESSAGE;
  }

  private branchValdiate(branch: string): string | void {
    const branchRegex = RegExp(/^\d{3}$/);

    if (!branch || !branchRegex.test(branch)) return BRANCH_ERROR_MESSAGE;
  }

  private accountValdiate(account: string): string | void {
    const accountRegex = RegExp(/^\d{7}-\d$/);
    if (!account || !accountRegex.test(account)) return ACCOUNT_ERROR_MESSAGE;
  }

  public validateCreateAccount(data: CreateAccountInput): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { account, branch, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      this.branchValdiate(branch),
      this.accountValdiate(account),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateGetAccount(data: GetAccountInput): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { account, id, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      id ? this.idValidate(id) : null,
      account ? this.accountValdiate(account) : null,
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }
}

export default AccountValidate;
