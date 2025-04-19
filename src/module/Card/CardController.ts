import { Request, Response } from 'express';
import { CustomError } from '../Utils/ErrorInterface';
import CardService from './CardService';

class CardController {
  async createCard(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId } = req.params;
      const user = req.user;
      const data = req.body;
      const newCard = await CardService.create({ ...data, accountId }, user);
      return res.status(200).send(newCard);
    } catch (error: CustomError | any) {
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async get(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.query;
      const user = req.user;
      const card = await CardService.get(data, user);
      return res.status(200).json(card);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { accountId } = req.params;
      const user = req.user;
      const newUser = await CardService.list(accountId, user);
      return res.status(200).json(newUser);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }

  async order(req: Request, res: Response): Promise<Response> {
    try {
      const query = req.query;
      const user = req.user;
      const pagination = await CardService.order(query, user);
      return res.status(200).json(pagination);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }
}

export default new CardController();
