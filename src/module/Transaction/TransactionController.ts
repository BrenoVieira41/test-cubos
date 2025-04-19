// criar transação (create, get, balance, order)
import { Request, Response } from 'express';
import { CustomError } from '../Utils/ErrorInterface';
import TransactionService from './TransactionService';

class TransactionController {
  async createTransaction(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId } = req.params;
      const user = req.user;
      const data = req.body;
      const newTransaction = await TransactionService.createTransaction(
        { ...data, accountId },
        user
      );
      return res.status(200).send(newTransaction);
    } catch (error: CustomError | any) {
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async transactionReversal(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId, transactionId } = req.params;
      const user = req.user;
      const { reversalReason } = req.body;
      const newTransaction = await TransactionService.transactionReversal(
        { reversalReason, accountId, transactionId },
        user
      );
      return res.status(200).send(newTransaction);
    } catch (error: CustomError | any) {
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async get(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = req.user;
      const transaction = await TransactionService.get(id, user);
      return res.status(200).json(transaction);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }

  async balance(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId } = req.params;
      const user = req.user;
      const balance = await TransactionService.balance(accountId, user);
      return res.status(200).json(balance);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }

  async createTransactionInternal(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId } = req.params;
      const user = req.user;
      const data = req.body;
      const newTransaction = await TransactionService.createTransactionInternal(
        { ...data, accountId },
        user
      );
      return res.status(200).send(newTransaction);
    } catch (error: CustomError | any) {
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async order(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId } = req.params;
      const query = req.query;
      const user = req.user;
      const pagination = await TransactionService.order({ ...query, accountId }, user);
      return res.status(200).json(pagination);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }
}
export default new TransactionController();
