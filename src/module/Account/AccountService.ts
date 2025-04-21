import { Prisma } from '@prisma/client';
import { CustomJwtPayload } from '../User/UserEntity';
import { USER_INVALID } from '../utils/UtilsConstants';
import { createError } from '../utils/UtilsService';
import { ACCOUNT_ALREADY_EXIST } from './AccountConstants';
import { Accounts } from './AccountEntity';
import AccountRepository from './AccountRepository';
import AccountValidate from './AccountValdiate';
import { CreateAccountInput } from './dto/create-account.input';
import { GetAccountInput } from './dto/get-account.input';

class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly accountValidate: AccountValidate;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.accountValidate = new AccountValidate();
  }

  public async create(data: CreateAccountInput, user: CustomJwtPayload): Promise<Accounts> {
    this.accountValidate.validateCreateAccount(data);

    try {
      const { account } = data;

      const accountAlreadyExist = await this.accountRepository.get({ account });

      if (accountAlreadyExist) throw createError(ACCOUNT_ALREADY_EXIST, 409);

      const newAccount: Accounts | any = await this.accountRepository.create({
        ...data,
        balance: 0,
      }, user.id);

      return newAccount;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async get(data: GetAccountInput, user: CustomJwtPayload): Promise<Accounts> {
    this.accountValidate.validateGetAccount(data);

    const { id } = user;

    try {
      const account = await this.accountRepository.get({ id: data.id, account: data.account });

      if (!account || account.userId !== id) throw createError(USER_INVALID, 409);

      return account;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async list(user: CustomJwtPayload): Promise<Accounts[]> {
    try {
      const { id } = user;
      const account = await this.accountRepository.list(id);

      return account;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async getBalance(id: string, userId?: string): Promise<Accounts> {
    try {
      const where: Prisma.AccountsWhereInput = { id };
      if (userId) where.userId = userId;

      const account = await this.accountRepository.getBalance(where);

      return account;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async validateUserAccounts(accountId: string, userId: string): Promise<void> {
    const accounts: Accounts[] = await this.accountRepository.findAccountByUser(userId);

    if (!accounts || !accounts.length) throw createError(USER_INVALID, 409);

    const accountsIds: string[] = accounts.map((it) => it.id);

    if (!accountsIds.includes(accountId)) throw createError(USER_INVALID, 409);
  }
}

export default new AccountService();
