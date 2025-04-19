import { cleanString, createError, paginate, setPagination, validateUserIsAdmin, idValidate } from '../utils/UtilsService';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login-user.input';
import { LOGIN_MESSAGE_ERROR, PERMISSION_ERROR_MESSAGE, USER_AREADY_EXIST } from './UserConstants';
import { CustomJwtPayload, UserLoginInterface, UserOrderInterface, UserRoleEnum, Users } from './UserEntity';
import UserRepository from './UserRepository';
import UserValidate from './UserValdiate';
import { sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';
import { UsersPagination } from './dto/get-user.input';
import { USER_INVALID } from '../utils/UtilsConstants';

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

      const cleanDocument = cleanString(document);

      const userAlreadyExist = await this.userRepository.get({ document: cleanDocument });

      if (userAlreadyExist) throw createError(USER_AREADY_EXIST, 409);

      const hashedPassword = await hash(password);
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

  public async userLogin(data: LoginInput): Promise<UserLoginInterface> {
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

  public async get(id: string, user: CustomJwtPayload): Promise<Users> {
    const idIsValid = idValidate(id);
    const { role } = user;

    if (idValidate) throw createError(idIsValid, 400);
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

  public async order(query: UsersPagination, user: CustomJwtPayload): Promise<UserOrderInterface> {
    const { role } = user;
    this.userValidate.validateOrder(query);

    validateUserIsAdmin(role);

    let { currentPage, itemsPerPage, ...filtersOnly } = query;
    const where: Record<string, any> = {};

    Object.entries(filtersOnly).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'name') {
        where[key] = { contains: value.trim(), mode: 'insensitive' };
      }
      else if (key === 'document') {
        const cleanDocument = cleanString(value);
        where[key] = { equals: cleanDocument };
      }
    });

    try {
      const { skip, take } = setPagination(query);

      const users = await this.userRepository.order(where, skip, take);

      const currentPage = Math.floor(skip / take) + 1;
      const pagination = paginate(take, currentPage);

      return {users, pagination};
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  private userResponse(data: Users): Users {
    Reflect.deleteProperty(data, 'password');

    return data;
  }

  public async validateUserAccounts(accountId: string, id: string): Promise<void> {
    const userAccount = await this.userRepository.userAccount(id);
    const userAccountsId: string[] = userAccount.accounts.map(it => it.id);

    if (!userAccountsId.includes(accountId)) throw createError(USER_INVALID, 409);
  }
}

export default new UserService();
