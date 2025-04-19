jest.mock('argon2', () => ({
  verify: jest.fn(),
  hash: jest.fn(),
}));

import UserService from '../UserService';
import { UserRoleEnum, Users } from '../UserEntity';
import {
  CNPJ_ERROR_MESSAGE,
  CPF_ERROR_MESSAGE,
  DOCUMENT_ERROR_MESSAGE,
  LOGIN_MESSAGE_ERROR,
  NAME_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  ROLE_ERROR_MESSAGE,
  USER_AREADY_EXIST,
} from '../UserConstants';
import * as argon2 from 'argon2';
import mockUserRepository from './moc';
import { VALUE_NOT_FOUND } from '../../utils/UtilsConstants';

let userService: typeof UserService;

describe('user - create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userService = UserService;

    // @ts-ignore
    userService['userRepository'] = mockUserRepository;
  });

  const base = {
    name: 'Test',
    password: 'Test@123',
    role: UserRoleEnum.client,
  };

  it('should throw error if user already exists', async () => {
    mockUserRepository.get.mockResolvedValueOnce({ id: '1' });

    await expect(userService.create({ ...base, document: '390.533.447-05' })).rejects.toThrow(
      USER_AREADY_EXIST
    );
  });

  it('should create a new user successfully', async () => {
    mockUserRepository.get.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValueOnce({
      id: 'df6b5b78-8ac2-4507-88cb-69950e3fe6b7',
      name: 'Lewis Hamilton',
      document: '39290380000181',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await userService.create({
      name: 'Lewis Hamilton',
      password: 'Test@123',
      document: '39290380000181',
      role: UserRoleEnum.client,
    });

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Lewis Hamilton');
    expect(result.document).toBe('39290380000181');
    expect(result.role).toBe('client');
  });

  it('should handle unknown errors gracefully', async () => {
    mockUserRepository.get.mockRejectedValueOnce(new Error('database failed'));

    await expect(userService.create({ ...base, document: '390.533.447-05' })).rejects.toThrow(
      'database failed'
    );
  });

  it('should throw error if data is null', () => {
    expect(() =>
      // @ts-ignore
      UserService['userValidate'].validateCreateUser(null)
    ).toThrow(VALUE_NOT_FOUND);
  });

  it('should throw error if name is invalid', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        ...base,
        name: '',
        document: '390.533.447-05',
      })
    ).toThrow(NAME_ERROR_MESSAGE);
  });

  it('should throw error if password is invalid', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        ...base,
        password: '',
        document: '390.533.447-05',
      })
    ).toThrow(PASSWORD_ERROR_MESSAGE);
  });

  it('should throw error if role is invalid', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        ...base,
        // @ts-ignore
        role: 'INVALID',
        document: '390.533.447-05',
      })
    ).toThrow(ROLE_ERROR_MESSAGE);
  });

  it('should throw error for invalid document', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        ...base,
        document: '123',
      })
    ).toThrow(DOCUMENT_ERROR_MESSAGE);
  });

  it('should throw error for invalid CPF', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        ...base,
        document: '111.111.111-11',
      })
    ).toThrow(CPF_ERROR_MESSAGE);
  });

  it('should throw error for invalid CNPJ', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        ...base,
        document: '11.111.111/0001-11',
      })
    ).toThrow(CNPJ_ERROR_MESSAGE);
  });

  it('should pass all validations with correct data', () => {
    expect(() =>
      UserService['userValidate'].validateCreateUser({
        name: 'Test',
        password: 'Test@123',
        role: UserRoleEnum.client,
        document: '390.533.447-05',
      })
    ).not.toThrow();
  });
});

describe('user - login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userService = UserService;

    // @ts-ignore
    userService['userRepository'] = mockUserRepository;

    (argon2.verify as jest.Mock).mockResolvedValue(true);
  });

  const base = {
    document: '390.533.447-05',
    password: 'Test@123',
  };

  const mockUser = {
    id: '9afeeb96-6c64-4c1b-9888-21a0ac96e2c2',
    name: 'Test',
    document: base.document,
    password: '$argon2id$fakeHash123',
    role: 'client',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should log in successfully', async () => {

    mockUserRepository.get.mockResolvedValueOnce(mockUser);

    const result = await userService.userLogin(base);

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result.user.document).toBe(base.document);
  });

  it("should throw if password it's not the same", async () => {
    const updated = {
      ...base,
      password: '123'
    };

    mockUserRepository.get.mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(userService.userLogin(updated)).rejects.toThrow(PASSWORD_ERROR_MESSAGE);
  });

  it('should throw if document is invalid', async () => {

    expect(() =>
      UserService['userValidate'].validateUserLogin({
        ...base,
        document: '123',
      })
    ).toThrow(DOCUMENT_ERROR_MESSAGE);
  });

  it('should throw if password is invalid', async () => {

    expect(() =>
      UserService['userValidate'].validateUserLogin({
        ...base,
        password: '123',
      })
    ).toThrow(PASSWORD_ERROR_MESSAGE);
  });


  it("should throw if document it's not the same", async () => {
    const updated = {
      ...base,
      document: '335.678.570-29'
    };

    mockUserRepository.get.mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(userService.userLogin(updated)).rejects.toThrow(LOGIN_MESSAGE_ERROR);
  });
});
