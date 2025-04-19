import { Request, Response } from 'express';
import { CustomError } from '../Utils/ErrorInterface';
import AccountService from './AccountService';

class AccountController {
  async createAccount(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const user = req.user;
      const newAccount = await AccountService.create(data, user);
      return res.status(200).send(newAccount);
    } catch (error: CustomError | any) {
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async getAccount(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.query;
      const user = req.user;
      const account = await AccountService.get(data, user);
      return res.status(200).json(account);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      const account = await AccountService.list(user);
      return res.status(200).json(account);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }
}

export default new AccountController();
