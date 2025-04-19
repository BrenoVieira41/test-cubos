import prisma from '../../prisma';
import { PRISMA_ERROR } from '../Utils/ErrorInterface';
import { Accounts } from './AccountEntity';
import { CreateAccountInput } from './dto/create-account.input';
import { GetAccountInput } from './dto/get-account.input';

class AccountRepository {
  async get(data: GetAccountInput): Promise<Accounts | any> {
    const { id, account } = data;

    try {
      const newAccount = await prisma.accounts.findFirst({
        where: {
          OR: [{ id }, {account}]
        },
      });
      return newAccount;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async list(userId: string): Promise<Accounts[] | any> {

    try {
      const accounts = await prisma.accounts.findMany({
        where: { userId },
      });
      return accounts;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async create(data: CreateAccountInput): Promise<Accounts | any> {
    try {
      const account = await prisma.accounts.create({ data });
      return account;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async getBalance(where: any): Promise<Accounts | any> {
    try {
      const account = await prisma.accounts.findUnique({ ...where });
      return account;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

}

export default AccountRepository;
