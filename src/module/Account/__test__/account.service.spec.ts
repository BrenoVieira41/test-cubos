import accountService from '../AccountService';
import mockAccountRepository from './moc';
import { VALUE_NOT_FOUND, ID_ERROR_MESSAGE, USER_INVALID } from '../../utils/UtilsConstants';
import {
  BRANCH_ERROR_MESSAGE,
  ACCOUNT_ERROR_MESSAGE,
  ACCOUNT_ALREADY_EXIST,
} from '../AccountConstants';
import { AuthUser } from '../../User/__test__/moc';
import { v4 as uuidv4 } from 'uuid';

const newId = uuidv4();

const baseAccount = {
  branch: '777',
  account: '4522244-3',
};

const completAccount = {
  ...baseAccount,
  userId: AuthUser.id,
  balance: 0,
};

const completAccount2 = {
  ...baseAccount,
  account: '1234567-0',
  userId: AuthUser.id,
  balance: 0,
};

describe('Account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    accountService['accountRepository'] = mockAccountRepository;
  });

  describe('Account - create', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(accountService.create()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore
      await expect(accountService.create({ batata: '123' })).rejects.toThrow(
        'Campos inválidos: [batata]'
      );
    });

    it('should throw if branch has invalid format (1 digit)', async () => {
      await expect(
        accountService.create({ ...baseAccount, branch: '1' }, AuthUser)
      ).rejects.toThrow(BRANCH_ERROR_MESSAGE);
    });

    it('should throw if account has invalid format (4 digits)', async () => {
      await expect(
        accountService.create({ ...baseAccount, account: '1234' }, AuthUser)
      ).rejects.toThrow(ACCOUNT_ERROR_MESSAGE);
    });

    it('should throw if account already exists', async () => {
      mockAccountRepository.get.mockResolvedValueOnce({ account: baseAccount.account });
      await expect(accountService.create(baseAccount, AuthUser)).rejects.toThrow(
        ACCOUNT_ALREADY_EXIST
      );
    });

    it('should create account successfully', async () => {
      mockAccountRepository.get.mockResolvedValueOnce(null);
      mockAccountRepository.create.mockResolvedValueOnce({
        id: newId,
        ...baseAccount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await accountService.create(baseAccount, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.branch).toBe(baseAccount.branch);
      expect(result.account).toBe(baseAccount.account);
    });
  });

  describe('Account - get', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(accountService.get()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore

      await expect(accountService.get({ batata: '123' }, AuthUser)).rejects.toThrow(
        'Campos inválidos: [batata]'
      );
    });

    it('should throw if id is invalid', async () => {
      await expect(accountService.get({ id: 'test' }, AuthUser)).rejects.toThrow(ID_ERROR_MESSAGE);
    });

    it('should throw if account is invalid (4 digits)', async () => {
      await expect(accountService.get({ account: 'test' }, AuthUser)).rejects.toThrow(
        ACCOUNT_ERROR_MESSAGE
      );
    });

    it('should throw if account does not exist', async () => {
      mockAccountRepository.get.mockResolvedValueOnce(null);

      await expect(accountService.get({ id: newId }, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should return account successfully using parameterId', async () => {
      mockAccountRepository.get.mockResolvedValueOnce({ ...completAccount, id: uuidv4() });

      const result = await accountService.get({ id: newId }, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.account).toBe(baseAccount.account);
      expect(result.branch).toBe(baseAccount.branch);
    });

    it('should return account successfully using parameterAccount', async () => {
      mockAccountRepository.get.mockResolvedValueOnce({ ...completAccount, id: uuidv4() });

      const result = await accountService.get({ account: baseAccount.account }, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.account).toBe(baseAccount.account);
      expect(result.branch).toBe(baseAccount.branch);
    });
  });

  describe('Account - list', () => {
    it('should list all accounts successfully', async () => {
      mockAccountRepository.list.mockResolvedValueOnce([
        { ...completAccount, id: uuidv4() },
        { ...completAccount2, id: uuidv4() },
      ]);

      const result = await accountService.list(AuthUser);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('account');
      expect(result[0].userId).toBe(AuthUser.id);
    });
  });
});
