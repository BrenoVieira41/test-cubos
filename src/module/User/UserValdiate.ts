import { cleanString, createError, isUUID, validateFields, validateIsNull, validatePagination } from '../utils/UtilsService';
import { CreateUserInput } from './dto/create-user.input';
import { UsersPagination } from './dto/get-user.input';
import { LoginInput } from './dto/login-user.input';
import {
  CNPJ_ERROR_MESSAGE,
  CPF_ERROR_MESSAGE,
  DOCUMENT_ERROR_MESSAGE,
  ID_ERROR_MESSAGE,
  NAME_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  ROLE_ERROR_MESSAGE,
  VALUE_NOT_FOUND,
} from './UserConstants';
import { UserRoleEnum } from './UserEntity';

class UserValidate {
  private nameValidate(name: string): string | void {
    if (!name || name.trim().length < 3 || name.length > 200) return NAME_ERROR_MESSAGE;
  }

  public idValidate(id: string): string | void {
    if (!isUUID(id)) return ID_ERROR_MESSAGE;
  }

  public passwordValidate(password: string): string | void {
    const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/);
    if (!password || !passwordRegex.test(password)) return PASSWORD_ERROR_MESSAGE;
  }

  public roleValidate(role?: UserRoleEnum): string | void {
    if (role && !(role in UserRoleEnum)) return ROLE_ERROR_MESSAGE;
  }

  private isCPFInvalid(cpf: string): boolean {
    if (!cpf) return true;

    const onlyNumbers = cpf.replace(/[^\d]/g, '');
    if (onlyNumbers.length !== 11) return true;

    const digits = onlyNumbers.split('').map(Number);

    if (/^(\d)\1{10}$/.test(onlyNumbers)) return true;

    const calculateCheckDigit = (slice: number[], weight: number): number =>
      (slice.reduce((acc, value, index) => acc + value * (weight - index), 0) * 10) % 11;

    const firstCheckDigit = calculateCheckDigit(digits.slice(0, 9), 10);
    const secondCheckDigit = calculateCheckDigit(digits.slice(0, 10), 11);

    const expectedFirstDigit = firstCheckDigit === 10 ? 0 : firstCheckDigit;
    const expectedSecondDigit = secondCheckDigit === 10 ? 0 : secondCheckDigit;

    const actualFirstDigit = digits[9];
    const actualSecondDigit = digits[10];

    if (expectedFirstDigit !== actualFirstDigit || expectedSecondDigit !== actualSecondDigit)
      return true;

    return false;
  }

  private isCNPJInvalid(cnpj: string): boolean {
    if (!cnpj) return true;

    const onlyNumbers = cnpj.replace(/[^\d]/g, '');

    if (onlyNumbers.length !== 14) return true;

    const numbers = onlyNumbers.split('').map(Number);

    const calcVerifierDigit = (base: number[]) => {
      const multipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const slice = multipliers.slice(multipliers.length - base.length);
      const sum = base.reduce((acc, val, i) => acc + val * slice[i], 0);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const firstDigit = calcVerifierDigit(numbers.slice(0, 12));
    const secondDigit = calcVerifierDigit([...numbers.slice(0, 12), firstDigit]);

    if (firstDigit !== numbers[12] || secondDigit !== numbers[13]) return true;

    return false;
  }

  public documentValidate(document: string): string | void {
    if (!document) return DOCUMENT_ERROR_MESSAGE;

    const formatDocument = cleanString(document);

    if (formatDocument.length === 11) {
      if (this.isCPFInvalid(formatDocument)) return CPF_ERROR_MESSAGE;
    } else if (formatDocument.length === 14) {
      if (this.isCNPJInvalid(formatDocument)) return CNPJ_ERROR_MESSAGE;
    } else {
      return DOCUMENT_ERROR_MESSAGE;
    }
  }

  public validateCreateUser(data: CreateUserInput): void {
    if (validateIsNull(data)) throw createError(VALUE_NOT_FOUND, 400);
    const { name, document, password, role, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      this.nameValidate(name),
      this.roleValidate(role),
      this.documentValidate(document),
      this.passwordValidate(password),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateUserLogin(data: LoginInput): void {
    const { document, password, ...rest } = data;

    validateFields(rest);

    const errors: string[] | any = [
      this.documentValidate(document),
      this.passwordValidate(password),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }

  public validateOrder(query: UsersPagination):void {
    const { name, document, currentPage, itemsPerPage, ...rest } = query;

    validateFields(rest);

    const errors: string[] | any = [
      document ? this.documentValidate(document) : null,
      validatePagination({ currentPage, itemsPerPage }),
    ].filter((error) => error);

    if (errors.length) throw createError(errors, 400);
  }
}

export default UserValidate;
