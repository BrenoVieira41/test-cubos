const mockAccountRepository = {
  get: jest.fn(),
  create: jest.fn(),
  list: jest.fn(),
  findAccountByUser: jest.fn(),
  getBalance: jest.fn(),
};

export default mockAccountRepository;
