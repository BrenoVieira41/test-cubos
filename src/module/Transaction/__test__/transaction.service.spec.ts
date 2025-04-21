import transactionService from '../TransactionService';
import accountService from '../../Account/AccountService';
import mockTransactionRepository from './moc';
import mockAccountRepository from '../../Account/__test__/moc';
import {
  CURRENT_PAGE_ERROR_MESSAGE,
  ID_ERROR_MESSAGE,
  ITEMS_PER_PAGE_ERROR_MESSAGE,
  USER_INVALID,
  VALUE_NOT_FOUND,
} from '../../utils/UtilsConstants';
import { AuthUser } from '../../User/__test__/moc';
import { v4 as uuidv4 } from 'uuid';
import { TransactionTypeEnum } from '../TransactionEntity';
import {
  ACCOUNT_ERROR_MESSAGE,
  DESCRIPTION_ERROR_MESSAGE,
  INSUFFICIENT_BALANCE_MESSAGE,
  INSUFFICIENT_REVERT_BALANCE_MESSAGE,
  ONLY_INTERNAL_MESSAGE_ERROR,
  RECEIVER_ERROR_MESSAGE,
  REVERSAL_ALREADY_USED,
  TRANSACTION_ID_ERROR_MESSAGE,
  TRANSACTION_NOT_FOUND,
  TRANSFER_TO_SAME_ACCOUNT_ERROR,
  TYPE_ERROR_MESSAGE,
  VALUE_ERROR_MESSAGE,
} from '../TransactionConstants';

const newId = uuidv4();

const baseTransaction = {
  type: TransactionTypeEnum.credit,
  description: 'teste base',
  value: 5.5,
  accountId: newId,
};

const completTransaction = {
  ...baseTransaction,
  receiverAccountId: uuidv4(),
};

const baseReverseTransaction = {
  transactionId: uuidv4(),
  reversalReason: 'estorno para test',
  accountId: uuidv4(),
};

const completReverseTransaction = {
  ...baseReverseTransaction,
  receiverAccountId: uuidv4(),
};

const mockUserWithAccount = (accountId: string) => {
  mockAccountRepository.findAccountByUser.mockResolvedValueOnce([{ id: accountId }]);
};

describe('Transaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    transactionService['transactionRepository'] = mockTransactionRepository;
    // @ts-ignore
    accountService['accountRepository'] = mockAccountRepository;
  });

  describe('Transaction - create', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(transactionService.createTransaction()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore
      await expect(transactionService.createTransaction({ b: '123' }, AuthUser)).rejects.toThrow(
        'Campos inválidos: [b]'
      );
    });

    it('should throw if accountId is invalid', async () => {
      await expect(
        transactionService.createTransaction(
          {
            ...baseTransaction,
            // @ts-ignore
            accountId: 'test',
          },
          AuthUser
        )
      ).rejects.toThrow(ACCOUNT_ERROR_MESSAGE);
    });

    it('should throw if type is invalid', async () => {
      await expect(
        transactionService.createTransaction(
          {
            ...baseTransaction,
            // @ts-ignore
            type: 'test',
          },
          AuthUser
        )
      ).rejects.toThrow(TYPE_ERROR_MESSAGE);
    });

    it('should throw if description is invalid', async () => {
      await expect(
        transactionService.createTransaction(
          {
            ...baseTransaction,
            // @ts-ignore
            description: '1',
          },
          AuthUser
        )
      ).rejects.toThrow(DESCRIPTION_ERROR_MESSAGE);
    });

    it('should throw if value is invalid', async () => {
      await expect(
        transactionService.createTransaction(
          {
            ...baseTransaction,
            // @ts-ignore
            value: 'j',
          },
          AuthUser
        )
      ).rejects.toThrow(VALUE_ERROR_MESSAGE);
    });

    it('should throw if user is not the owner of the account', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce(undefined);

      await expect(transactionService.createTransaction(baseTransaction, AuthUser)).rejects.toThrow(
        USER_INVALID
      );
    });

    it('should throw if debit type and balance is insufficient', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce({ balance: 1 });

      await expect(
        transactionService.createTransaction(
          { ...baseTransaction, type: TransactionTypeEnum.debit },
          AuthUser
        )
      ).rejects.toThrow(INSUFFICIENT_BALANCE_MESSAGE);
    });

    it('should create transaction successfully', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: baseTransaction.accountId });
      mockTransactionRepository.createTransaction.mockResolvedValueOnce({
        id: uuidv4(),
        ...completTransaction,
        receiverAccountId: baseTransaction.accountId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await transactionService.createTransaction(baseTransaction, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.value).toBe(baseTransaction.value);
      expect(result.description).toBe(baseTransaction.description);
    });
  });

  describe('Transaction - get', () => {
    it('should throw if id is invalid', async () => {
      await expect(transactionService.get('test', AuthUser)).rejects.toThrow(ID_ERROR_MESSAGE);
    });

    it('Should be thrown if the transaction does not exist', async () => {
      mockAccountRepository.get.mockResolvedValueOnce(undefined);
      await expect(transactionService.get(newId, AuthUser)).rejects.toThrow(TRANSACTION_NOT_FOUND);
    });

    it('Should be thrown if the transaction is not from the user', async () => {
      mockTransactionRepository.get.mockResolvedValueOnce({ accountId: newId });
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce(undefined);

      await expect(transactionService.get(newId, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should return transaction successfully', async () => {
      mockUserWithAccount(baseTransaction.accountId);
      mockTransactionRepository.get.mockResolvedValueOnce({
        ...baseTransaction,
        accountId: newId,
        id: uuidv4(),
      });

      const result = await transactionService.get(newId, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.value).toBe(baseTransaction.value);
      expect(result.description).toBe(baseTransaction.description);
      expect(result.type).toBe(baseTransaction.type);
    });
  });

  describe('Transaction - balance', () => {
    it('should throw if accountId is invalid', async () => {
      await expect(transactionService.balance('test', AuthUser)).rejects.toThrow(
        ACCOUNT_ERROR_MESSAGE
      );
    });

    it('should throw if user does not exist', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce(undefined);

      await expect(transactionService.balance(newId, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should return balance successfully', async () => {
      const randomBalance = 50;
      mockAccountRepository.getBalance.mockResolvedValueOnce({ balance: randomBalance });

      const result = await transactionService.balance(newId, AuthUser);

      expect(result).toHaveProperty('balance');
      expect(result.balance).toBe(randomBalance);
    });
  });

  describe('Transaction - createTransactionInternal', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(transactionService.createTransaction()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore
      await expect(transactionService.createTransaction({ b: '123' }, AuthUser)).rejects.toThrow(
        'Campos inválidos: [b]'
      );
    });

    it('should throw if accountId is invalid', async () => {
      await expect(
        transactionService.createTransactionInternal(
          {
            ...completTransaction,
            // @ts-ignore
            accountId: 'test',
          },
          AuthUser
        )
      ).rejects.toThrow(ACCOUNT_ERROR_MESSAGE);
    });

    it('should throw if receiverAccountId is invalid', async () => {
      await expect(
        transactionService.createTransactionInternal(
          {
            ...completTransaction,
            // @ts-ignore
            receiverAccountId: 'test',
          },
          AuthUser
        )
      ).rejects.toThrow(RECEIVER_ERROR_MESSAGE);
    });

    it('should throw if description is invalid', async () => {
      await expect(
        transactionService.createTransactionInternal(
          {
            ...completTransaction,
            // @ts-ignore
            description: '1',
          },
          AuthUser
        )
      ).rejects.toThrow(DESCRIPTION_ERROR_MESSAGE);
    });

    it('should throw if value is invalid', async () => {
      await expect(
        transactionService.createTransaction(
          {
            ...completTransaction,
            // @ts-ignore
            value: 'j',
          },
          AuthUser
        )
      ).rejects.toThrow(VALUE_ERROR_MESSAGE);
    });

    it('should throw if user is the same for both accounts', async () => {
      await expect(
        transactionService.createTransactionInternal(
          {
            ...completTransaction,
            // @ts-ignore
            receiverAccountId: completTransaction.accountId,
          },
          AuthUser
        )
      ).rejects.toThrow(TRANSFER_TO_SAME_ACCOUNT_ERROR);
    });

    it('should throw if user is not the owner of the account', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce(undefined);

      await expect(
        transactionService.createTransactionInternal(completTransaction, AuthUser)
      ).rejects.toThrow(USER_INVALID);
    });

    it('should create transaction if sufficient balance', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce({ balance: 1 });

      await expect(
        transactionService.createTransactionInternal(completTransaction, AuthUser)
      ).rejects.toThrow(INSUFFICIENT_BALANCE_MESSAGE);
    });

    it('should create transaction internal successfully', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: baseTransaction.accountId });
      mockTransactionRepository.createTransactionInternal.mockResolvedValueOnce({
        id: uuidv4(),
        ...completTransaction,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await transactionService.createTransactionInternal(
        completTransaction,
        AuthUser
      );

      expect(result).toHaveProperty('id');
      expect(result.value).toBe(baseTransaction.value);
      expect(result.description).toBe(baseTransaction.description);
    });
  });

  describe('Transaction - transactionReversal', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(transactionService.createTransaction()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore
      await expect(transactionService.createTransaction({ b: '123' }, AuthUser)).rejects.toThrow(
        'Campos inválidos: [b]'
      );
    });

    it('should throw if transactionId is invalid', async () => {
      await expect(
        transactionService.transactionReversal(
          {
            ...baseReverseTransaction,
            // @ts-ignore
            transactionId: 'test',
          },
          AuthUser
        )
      ).rejects.toThrow(TRANSACTION_ID_ERROR_MESSAGE);
    });

    it('should throw if accountId is invalid', async () => {
      await expect(
        transactionService.transactionReversal(
          {
            ...baseReverseTransaction,
            // @ts-ignore
            accountId: 'test',
          },
          AuthUser
        )
      ).rejects.toThrow(ACCOUNT_ERROR_MESSAGE);
    });

    it('should throw if reversalReason is empty', async () => {
      await expect(
        transactionService.transactionReversal(
          {
            ...baseReverseTransaction,
            // @ts-ignore
            reversalReason: '',
          },
          AuthUser
        )
      ).rejects.toThrow(DESCRIPTION_ERROR_MESSAGE);
    });

    it('should throw if transaction does not exist', async () => {
      mockAccountRepository.get.mockResolvedValueOnce(undefined);
      await expect(
        transactionService.transactionReversal(baseReverseTransaction, AuthUser)
      ).rejects.toThrow(TRANSACTION_NOT_FOUND);
    });

    it('should throw if transaction is not internal', async () => {
      mockTransactionRepository.get.mockResolvedValueOnce({
        accountId: newId,
        receiverAccountId: newId,
      });

      await expect(
        transactionService.transactionReversal(baseReverseTransaction, AuthUser)
      ).rejects.toThrow(ONLY_INTERNAL_MESSAGE_ERROR);
    });

    it('should throw if transaction was already reversed', async () => {
      mockTransactionRepository.get.mockResolvedValueOnce({
        accountId: completReverseTransaction.accountId,
        receiverAccountId: completReverseTransaction.receiverAccountId,
        reversedAt: new Date(),
      });

      await expect(
        transactionService.transactionReversal(baseReverseTransaction, AuthUser)
      ).rejects.toThrow(REVERSAL_ALREADY_USED);
    });

    it('should throw if user does not belong to transaction', async () => {
      mockTransactionRepository.get.mockResolvedValueOnce({
        accountId: completReverseTransaction.accountId,
        receiverAccountId: completReverseTransaction.receiverAccountId,
      });
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: uuidv4(), userId: '123' });

      await expect(
        transactionService.transactionReversal(baseReverseTransaction, AuthUser)
      ).rejects.toThrow(TRANSACTION_NOT_FOUND);
    });

    it('should throw if user does not belong to transaction', async () => {
      mockTransactionRepository.get.mockResolvedValueOnce({
        accountId: completReverseTransaction.accountId,
        receiverAccountId: completReverseTransaction.receiverAccountId,
      });
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: uuidv4(), userId: '123' });
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: uuidv4(), userId: '321' });

      await expect(
        transactionService.transactionReversal(baseReverseTransaction, AuthUser)
      ).rejects.toThrow(TRANSACTION_NOT_FOUND);
    });

    it('should throw if final account has insufficient funds to reverse', async () => {
      const accountId = completReverseTransaction.accountId;
      mockTransactionRepository.get.mockResolvedValueOnce({
        accountId: accountId,
        receiverAccountId: completReverseTransaction.receiverAccountId,
        value: 10,
      });
      mockAccountRepository.getBalance.mockResolvedValueOnce({
        id: accountId,
        userId: AuthUser.id,
      });
      mockAccountRepository.getBalance.mockResolvedValueOnce({
        id: uuidv4(),
        userId: '321',
        balance: 5,
      });

      await expect(
        transactionService.transactionReversal(baseReverseTransaction, AuthUser)
      ).rejects.toThrow(INSUFFICIENT_REVERT_BALANCE_MESSAGE);
    });

    it('should reverse transaction successfully', async () => {
      const newValue = 5;
      const accountId = completReverseTransaction.accountId;
      mockTransactionRepository.get.mockResolvedValueOnce({
        accountId: accountId,
        receiverAccountId: completReverseTransaction.receiverAccountId,
        value: newValue,
      });
      mockAccountRepository.getBalance.mockResolvedValueOnce({
        id: accountId,
        userId: AuthUser.id,
      });
      mockAccountRepository.getBalance.mockResolvedValueOnce({
        id: uuidv4(),
        userId: '321',
        balance: 10,
      });
      mockTransactionRepository.reverseTransaction.mockResolvedValueOnce({
        id: uuidv4(),
        value: newValue,
        description: baseReverseTransaction.reversalReason,
        createdAt: new Date(),
        updatedAt: new Date(),
        reversedAt: new Date(),
      });

      const result = await transactionService.transactionReversal(baseReverseTransaction, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.value).toBe(newValue);
      expect(result.reversedAt).toBeInstanceOf(Date);
    });
  });

  describe('Transaction - order', () => {
    it('should validate itemsPerPage properly', async () => {
      await expect(transactionService.order({ itemsPerPage: 'j' }, AuthUser)).rejects.toThrow(
        ITEMS_PER_PAGE_ERROR_MESSAGE
      );
    });

    it('should validate currentPage properly', async () => {
      await expect(transactionService.order({ currentPage: 'j' }, AuthUser)).rejects.toThrow(
        CURRENT_PAGE_ERROR_MESSAGE
      );
    });

    it('should throw if accountId is invalid', async () => {
      await expect(transactionService.order({ accountId: 'test' }, AuthUser)).rejects.toThrow(
        ACCOUNT_ERROR_MESSAGE
      );
    });

    it('should throw if type is invalid', async () => {
      // @ts-ignore
      await expect(transactionService.order({ type: 'test' }, AuthUser)).rejects.toThrow(
        TYPE_ERROR_MESSAGE
      );
    });

    it('should throw if account does not belong to user', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce(undefined);

      await expect(
        transactionService.order({ accountId: baseTransaction.accountId }, AuthUser)
      ).rejects.toThrow(USER_INVALID);
    });

    it('should return ordered cards successfully', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: completTransaction.accountId });
      mockTransactionRepository.order.mockResolvedValueOnce([
        { ...completTransaction, id: uuidv4() },
        { ...completTransaction, id: uuidv4() },
      ]);

      const result = await transactionService.order(
        { accountId: baseTransaction.accountId },
        AuthUser
      );

      expect(Array.isArray(result.transactions)).toBe(true);
      expect(result.transactions.length).toBe(2);
      expect(result).toHaveProperty('pagination');
    });

    it('should return ordered cards successfully using type', async () => {
      mockAccountRepository.getBalance.mockResolvedValueOnce({ id: completTransaction.accountId });
      mockTransactionRepository.order.mockResolvedValueOnce([
        { ...completTransaction, type: TransactionTypeEnum.credit, id: uuidv4() },
      ]);

      const result = await transactionService.order(
        { accountId: baseTransaction.accountId, type: TransactionTypeEnum.credit },
        AuthUser
      );

      expect(Array.isArray(result.transactions)).toBe(true);
      expect(result.transactions.length).toBe(1);
      expect(result).toHaveProperty('pagination');
      expect(result.transactions[0].type).toBe(TransactionTypeEnum.credit);
    });
  });
});
