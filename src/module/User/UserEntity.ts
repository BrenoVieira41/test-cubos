import { JwtPayload } from 'jsonwebtoken';
import { Accounts } from '../Account/AccountEntity';
import { PaginationComplement } from '../utils/PaginationInterface';

export enum UserRoleEnum {
  admin = 'admin',
  client = 'client',
}

export class Users {
  id: string;
  name: string;
  document: string;
  password: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;

  accounts?: Accounts[];
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  document: string;
  role: UserRoleEnum;
}

export interface UserLoginInterface {
  user: Users,
  token: string;
}

export interface UserOrderInterface {
  users: Users[],
  pagination: PaginationComplement;
}
