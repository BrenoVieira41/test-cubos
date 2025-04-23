import { Transactions } from 'generated/prisma';
import { CreateTransactionInput } from './dto/create-transaction.input';
import prisma from '../../prisma';
import { PRISMA_ERROR } from '../Utils/ErrorInterface';
import { TransactionTypeEnum } from './TransactionEntity';
import { ReverseTransactionInput } from './dto/reverte-transaction.input';
import { Prisma } from '@prisma/client';

class TransactionRepository {
  async createTransaction(data: CreateTransactionInput, query: object): Promise<Transactions | any> {
    const { accountId, description, type, value } = data;

    return prisma.$transaction(async (tx) => {
      await tx.accounts.update({
        where: { id: accountId },
        data: {
          balance: {
            ...query
          },
        },
      });

      const transaction = await tx.transactions.create({
        data: {
          value,
          description,
          type,
          accountId,
          receiverAccountId: accountId,
        },
      });

      return transaction;
    });
  }

  async createTransactionInternal(data: CreateTransactionInput): Promise<Transactions | any> {
    const { accountId, description, value, receiverAccountId, type } = data;
    return prisma.$transaction(async (tx) => {
      await tx.accounts.update({
        where: { id: receiverAccountId },
        data: {
          balance: {
            increment: value,
          },
        },
      });

      await tx.accounts.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: value,
          },
        },
      });

      const transaction = await tx.transactions.create({
        data: {
          value,
          description,
          type: type,
          accountId: accountId,
          receiverAccountId: receiverAccountId,
        },
      });

      return transaction;
    });
  }

  async reverseTransaction(id: string, data: ReverseTransactionInput, value: number, currentDate: Date): Promise<Transactions | any> {
    const { accountId, receiverAccountId, reversalReason } = data;
    return prisma.$transaction(async (tx) => {
      await tx.accounts.update({
        where: { id: receiverAccountId },
        data: {
          balance: {
            decrement: value,
          },
        },
      });

      await tx.accounts.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: value,
          },
        },
      });

      const transaction = await tx.transactions.update({
        where: {id},
        data: {
          reversedAt: currentDate,
          receiverAccountId: receiverAccountId,
          reversalReason
        },
      });

      return transaction;
    });
  }

  async get(id: string): Promise<Transactions | any> {
    try {
      const card = await prisma.transactions.findUnique({
        where: { id },
      });
      return card;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async order(query: Prisma.TransactionsWhereInput, skip: number, take: number): Promise<Transactions[] | any> {
    try {
      const transactions = await prisma.transactions.findMany({
        where: query,
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
      });

      return transactions;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }
}

export default TransactionRepository;
