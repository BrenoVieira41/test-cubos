import { UserRoleEnum } from '../UserEntity';

export class CreateUserInput {
  name: string;
  document: string;
  password: string;
  role?: UserRoleEnum;
}
