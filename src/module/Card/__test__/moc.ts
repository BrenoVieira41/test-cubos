const mockCardRepository = {
  get: jest.fn(),
  create: jest.fn(),
  cardAlreadyExist: jest.fn(),
  getPhysicalCardCount: jest.fn(),
  list: jest.fn(),
  order: jest.fn(),
  getBalance: jest.fn(),
};

export default mockCardRepository;
