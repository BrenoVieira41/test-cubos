import { UserRoleEnum } from "../UserEntity";

const mockUserRepository = {
  get: jest.fn(),
  userAccount: jest.fn(),
  create: jest.fn(),
};

export const firstUser = {
  id: '1b0ba661-3d46-4127-9768-1b575f82acbb',
  name: 'test1',
  document: '46268955000125',
  role: UserRoleEnum.client,
  createdAt: '2025-04-17T09:23:18.513Z',
  updatedAt: '2025-04-17T09:23:18.513Z',
};

export const secondUser = {
  id: '1b0ba661-3d46-4127-9768-1b575f82acbb',
  name: 'test2',
  document: '55635755003',
  role: UserRoleEnum.client,
  createdAt: '2025-04-17T09:23:18.513Z',
  updatedAt: '2025-04-17T09:23:18.513Z',
};

export const AuthUser = {
  id: '1b0ba661-3d46-4127-9768-1b575f82acbb',
  name: 'test1',
  document: '46268955000125',
  role: UserRoleEnum.client
};

export default mockUserRepository;
