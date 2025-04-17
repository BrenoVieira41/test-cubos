import { Request, Response } from 'express';
import { CustomError } from '../Utils/ErrorInterface';
import UserService from './UserService';

class UserController {
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newUser = await UserService.create(data);
      return res.status(200).send(newUser);
    } catch (error: CustomError | any) {
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const userLogin = await UserService.userLogin(data);
      return res.status(200).send(userLogin);
    } catch (error: CustomError | any) {
      console.error(error);
      return res.status(error.status || 500).json({ message: error.message?.split('\n') });
    }
  }

  async get(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = req.user;
      const newUser = await UserService.get(id, user);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message.split('\n') });
    }
  }

  // async order(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const query = req.query;
  //     const user = req.user;
  //     // const orderUsers = await UserService.order(query, user);
  //     return res.status(200).json(orderUsers);
  //   } catch (error: any) {
  //     return res.status(500).json({ message: error.message.split('\n') });
  //   }
  // }

}

export default new UserController();
