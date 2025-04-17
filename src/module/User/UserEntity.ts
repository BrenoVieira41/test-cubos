import { JwtPayload } from 'jsonwebtoken';

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
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  document: string;
  role: UserRoleEnum
}
