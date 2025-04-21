const mockTransactionRepository = {
  get: jest.fn(),
  createTransaction: jest.fn(),
  createTransactionInternal: jest.fn(),
  reverseTransaction: jest.fn(),
  order: jest.fn(),
  getBalance: jest.fn(),
};

export default mockTransactionRepository;
