import { cleanString, createError } from '../utils/UtilsService';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login-user.input';
import { LOGIN_MESSAGE_ERROR, PERMISSION_ERROR_MESSAGE, USER_AREADY_EXIST } from './UserConstants';
import { CustomJwtPayload, UserRoleEnum, Users } from './UserEntity';
import UserRepository from './UserRepository';
import UserValidate from './UserValdiate';
import { sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';

class UserService {
  private readonly userRepository: UserRepository;
  private readonly userValidate: UserValidate;

  constructor() {
    this.userRepository = new UserRepository();
    this.userValidate = new UserValidate();
  }

  public async create(data: CreateUserInput): Promise<Users> {
    this.userValidate.validateCreateUser(data);

    try {
      const { document, password, role } = data;

      const userAlreadyExist = await this.userRepository.get({ document });

      if (userAlreadyExist) throw createError(USER_AREADY_EXIST, 409);

      const hashedPassword = await hash(password);
      const cleanDocument = cleanString(document);
      const userRole = role ? role : UserRoleEnum.client;

      const user: Users | any = await this.userRepository.create({
        ...data,
        password: hashedPassword,
        document: cleanDocument,
        role: userRole,
      });

      return this.userResponse(user);
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async userLogin(data: LoginInput) {
    this.userValidate.validateUserLogin(data);
    try {
      const { document, password } = data;
      const secret = process.env.JWT_SECRET || 'secret';
      const user = await this.userRepository.get({ document });

      if (!user) throw createError(LOGIN_MESSAGE_ERROR, 401);
      const isValidPassword = await verify(user.password, password);

      if (!isValidPassword) throw createError(LOGIN_MESSAGE_ERROR, 401);

      const newUser = this.userResponse(user);

      const token = sign({ ...newUser }, secret, { expiresIn: '1w' });
      return { user, token };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async get(id: string, user: CustomJwtPayload): Promise<any> {
    const idValidate = this.userValidate.idValidate(id);
    const { role } = user;

    if (idValidate) throw createError(idValidate, 400);
    const isAdmin = role === UserRoleEnum.admin;
    const isOwner = user.id === id;

    if (!isOwner && !isAdmin) throw createError(PERMISSION_ERROR_MESSAGE, 403);

    try {
      const user = await this.userRepository.get({ id });

      return this.userResponse(user);
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  private userResponse(data: Users): Users {
    Reflect.deleteProperty(data, 'password');

    return data;
  }
}

export default new UserService();
