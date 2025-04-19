// order

import AccountService from '../Account/AccountService';
import { CustomJwtPayload } from '../User/UserEntity';
import UserService from '../User/UserService';
import { USER_INVALID } from '../utils/UtilsConstants';
import { createError, idValidate, paginate, setPagination, valueFormat } from '../utils/UtilsService';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionPagination } from './dto/get-transaction.input';
import { ReverseTransactionInput } from './dto/reverte-transaction.input';
import {
  INSUFFICIENT_BALANCE_MESSAGE,
  INSUFFICIENT_REVERT_BALANCE_MESSAGE,
  ONLY_INTERNAL_MESSAGE_ERROR,
  REVERSAL_ALREADY_USED,
  TRANSACTION_NOT_FOUND,
} from './TransactionConstants';
import { Transactions, TransactionTypeEnum } from './TransactionEntity';
import TransactionRepository from './TransactionRepository';
import TransactionValidate from './TransactionValdiate';

class TransactionService {
  private readonly transactionRepository: TransactionRepository;
  private readonly transactionValidate: TransactionValidate;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.transactionValidate = new TransactionValidate();
  }

  public async createTransaction(
    data: CreateTransactionInput,
    user: CustomJwtPayload
  ): Promise<any> {
    this.transactionValidate.validateTransaction(data, true);

    const { id } = user;
    const { accountId, type } = data;

    const value = valueFormat(data.value);

    try {
      const myAccount = await AccountService.getBalance(accountId, id);
      const isDebit = type === TransactionTypeEnum.debit;
      let logic = isDebit ? { decrement: value } : { increment: value };

      if (!myAccount) throw createError(USER_INVALID, 409);
      if (isDebit && myAccount.balance < value)
        throw createError(INSUFFICIENT_BALANCE_MESSAGE, 400);

      const setValues = await this.transactionRepository.createTransaction(
        {
          ...data,
          receiverAccountId: accountId,
          value,
        },
        logic
      );

      return {
        id: setValues.id,
        value: setValues.value,
        description: setValues.description,
        createdAt: setValues.createdAt,
        updatedAt: setValues.updatedAt,
      };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async get(id: string, user: CustomJwtPayload): Promise<Transactions> {
    idValidate(id);

    try {
      const transaction = await this.transactionRepository.get(id);

      if (!transaction) throw createError(TRANSACTION_NOT_FOUND, 400);

      await UserService.validateUserAccounts(transaction.accountId, user.id);

      return transaction;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async balance(accountId: string, user: CustomJwtPayload): Promise<Object> {
    idValidate(accountId);

    const { id } = user;

    try {
      const myAccount = await AccountService.getBalance(accountId, id);

      if (!myAccount) throw createError(USER_INVALID, 409);

      return { balance: myAccount.balance };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async createTransactionInternal(
    data: CreateTransactionInput,
    user: CustomJwtPayload
  ): Promise<any> {
    this.transactionValidate.validateTransaction(data, false);

    const { id } = user;
    const { accountId, receiverAccountId } = data;

    const value = valueFormat(data.value);
    try {
      const myAccount = await AccountService.getBalance(accountId, id);

      if (!myAccount) throw createError(USER_INVALID, 409);
      if (myAccount.balance < value) throw createError(INSUFFICIENT_BALANCE_MESSAGE, 400);

      const setValues = await this.transactionRepository.createTransactionInternal({
        ...data,
        value,
      });

      return {
        id: setValues.id,
        receiverAccountId: setValues.receiverAccountId,
        value: setValues.value,
        description: setValues.description,
        createdAt: setValues.createdAt,
        updatedAt: setValues.updatedAt,
      };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async transactionReversal(
    data: ReverseTransactionInput,
    user: CustomJwtPayload
  ): Promise<any> {
    this.transactionValidate.validateTransactionReversal(data);

    const { id } = user;
    const { accountId, transactionId, reversalReason } = data;

    try {
      const transaction = await this.transactionRepository.get(transactionId);

      if (!transaction) throw createError(TRANSACTION_NOT_FOUND, 400);

      if (transaction.accountId === transaction.receiverAccountId)
        throw createError(ONLY_INTERNAL_MESSAGE_ERROR, 400);

      if (transaction.reversedAt) throw createError(REVERSAL_ALREADY_USED, 400);

      const [senderAccount, receiverAccount] = await Promise.all([
        AccountService.getBalance(transaction.accountId),
        AccountService.getBalance(transaction.receiverAccountId),
      ]);

      const isSender = senderAccount.userId === id;
      const isReceiver = receiverAccount.userId === id;

      if (!isSender && !isReceiver) throw createError(TRANSACTION_NOT_FOUND, 409);

      if (receiverAccount.balance < transaction.value)
        throw createError(INSUFFICIENT_REVERT_BALANCE_MESSAGE, 400);

      if (![senderAccount.id, receiverAccount.id].includes(accountId))
        throw createError(TRANSACTION_NOT_FOUND, 409);

      const setTransaction = await this.transactionRepository.reverseTransaction(
        transactionId,
        {
          accountId: transaction.accountId,
          receiverAccountId: transaction.receiverAccountId,
          reversalReason,
          transactionId,
        },
        transaction.value,
        new Date()
      );

      return {
        id: setTransaction.id,
        value: setTransaction.value,
        description: setTransaction.reversalReason,
        createdAt: setTransaction.createdAt,
        updatedAt: setTransaction.updatedAt,
        reversedAt: setTransaction.reversedAt,
      };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async order(query: TransactionPagination, user: CustomJwtPayload): Promise<any> {
    this.transactionValidate.validateOrder(query);

    const { accountId, type } = query;
    const { id } = user;

    try {
      const { skip, take } = setPagination(query);
      const myAccount = await AccountService.getBalance(accountId, id);

      if (!myAccount) throw createError(USER_INVALID, 409);

      const where: any = { OR: [{accountId: myAccount.id}, {receiverAccountId: myAccount.id}] };

      if (type) where.type = type;

      const currentPage = Math.floor(skip / take) + 1;

      const transactions = await this.transactionRepository.order(where, skip, take);
      const pagination = paginate(take, currentPage, transactions.length);

      return { transactions, pagination };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

}

export default new TransactionService();
