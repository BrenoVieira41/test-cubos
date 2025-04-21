import cardService from '../CardService';
import accountService from '../../Account/AccountService';
import mockCardRepository from './moc';
import {
  CURRENT_PAGE_ERROR_MESSAGE,
  ITEMS_PER_PAGE_ERROR_MESSAGE,
  USER_INVALID,
  VALUE_NOT_FOUND,
} from '../../utils/UtilsConstants';
import { AuthUser } from '../../User/__test__/moc';
import { v4 as uuidv4 } from 'uuid';
import { CardTypeEnum } from '../CardEntity';
import {
  ACCOUNT_ID_ERROR_MESSAGE,
  ALREADY_USED_PHYSICAL_CARD,
  CARD_ALREADY_EXIST,
  CARD_NOT_FOUND,
  CVV_ERROR_MESSAGE,
  NUMBER_ERROR_MESSAGE,
  TYPE_ERROR_MESSAGE,
} from '../CardConstants';
import { ID_ERROR_MESSAGE } from '../../utils/UtilsConstants';
import mockAccountRepository from '../../Account/__test__/moc';

const newId = uuidv4();

const baseCard = {
  number: '1415 1617 2020 4444',
  cvv: '001',
  type: CardTypeEnum.physical,
};

const completCard = {
  ...baseCard,
  accountId: uuidv4(),
};

const completCard2 = {
  ...baseCard,
  number: '7777 7777 7777 7777',
  type: CardTypeEnum.virtual,
  accountId: uuidv4(),
};

const mockUserWithAccount = (accountId: string) => {
  mockAccountRepository.findAccountByUser.mockResolvedValueOnce([{ id: accountId }]);
};

describe('Account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    cardService['cardRepository'] = mockCardRepository;
    // @ts-ignore
    accountService['accountRepository'] = mockAccountRepository;
  });

  describe('Card - create', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(cardService.create()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore
      await expect(cardService.create({ batata: '123' }, AuthUser)).rejects.toThrow(
        'Campos inválidos: [batata]'
      );
    });

    it('should throw if type is invalid (empty)', async () => {
      await expect(
        // @ts-ignore
        cardService.create({ ...baseCard, type: test }, AuthUser)
      ).rejects.toThrow(TYPE_ERROR_MESSAGE);
    });

    it('should throw if accountId is invalid', async () => {
      await expect(
        cardService.create({ ...completCard, accountId: '1' }, AuthUser)
      ).rejects.toThrow(ACCOUNT_ID_ERROR_MESSAGE);
    });

    it('should throw if cvv is invalid (empty)', async () => {
      await expect(cardService.create({ ...completCard, cvv: '1' }, AuthUser)).rejects.toThrow(
        CVV_ERROR_MESSAGE
      );
    });

    it('should throw if number is invalid (e.g. 123)', async () => {
      await expect(cardService.create({ ...completCard, number: '1' }, AuthUser)).rejects.toThrow(
        NUMBER_ERROR_MESSAGE
      );
    });

    it('should throw if number is invalid (e.g. 123)', async () => {
      await expect(cardService.create({ ...completCard, number: '1' }, AuthUser)).rejects.toThrow(
        NUMBER_ERROR_MESSAGE
      );
    });

    it('should throw if account does not exist', async () => {
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce(undefined);

      await expect(cardService.create(completCard, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should throw if account does not belong to the user', async () => {
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce({
        accounts: [{ id: uuidv4() }],
      });

      await expect(cardService.create(completCard, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should throw if card already exists', async () => {
      mockUserWithAccount(completCard.accountId);

      mockCardRepository.cardAlreadyExist.mockResolvedValueOnce(true);

      await expect(cardService.create(completCard, AuthUser)).rejects.toThrow(CARD_ALREADY_EXIST);
    });

    it('should throw if physical card already exists', async () => {
      mockUserWithAccount(completCard.accountId);

      mockCardRepository.getPhysicalCardCount.mockResolvedValueOnce(1);

      await expect(
        cardService.create({ ...completCard, type: CardTypeEnum.physical }, AuthUser)
      ).rejects.toThrow(ALREADY_USED_PHYSICAL_CARD);
    });

    it('should create card successfully', async () => {
      mockUserWithAccount(completCard.accountId);
      mockCardRepository.create.mockResolvedValueOnce({
        id: newId,
        ...completCard,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await cardService.create(completCard, AuthUser);

      const responseNumber = cardService.formatLastCardNumber(baseCard.number);

      expect(result).toHaveProperty('id');
      expect(result.number).toBe(responseNumber);
      expect(result.cvv).toBe(baseCard.cvv);
      expect(result.type).toBe(baseCard.type);
    });
  });

  describe('Card - get', () => {
    it('should throw if no data is provided', async () => {
      // @ts-ignore
      await expect(cardService.get()).rejects.toThrow(VALUE_NOT_FOUND);
    });

    it('should throw if input has unexpected value', async () => {
      // @ts-ignore
      await expect(cardService.get({ batata: '123' }, AuthUser)).rejects.toThrow(
        'Campos inválidos: [batata]'
      );
    });

    it('should throw if id is invalid', async () => {
      await expect(cardService.get({ id: 'test' }, AuthUser)).rejects.toThrow(ID_ERROR_MESSAGE);
    });

    it('should throw if number is invalid', async () => {
      await expect(cardService.get({ number: '1' }, AuthUser)).rejects.toThrow(
        NUMBER_ERROR_MESSAGE
      );
    });

    it('should throw if accountId is invalid', async () => {
      await expect(cardService.get({ accountId: '1' }, AuthUser)).rejects.toThrow(
        ACCOUNT_ID_ERROR_MESSAGE
      );
    });

    it('should throw if no card is found', async () => {
      mockCardRepository.get.mockResolvedValueOnce(false);

      await expect(cardService.get({ id: newId }, AuthUser)).rejects.toThrow(CARD_NOT_FOUND);
    });

    it('should throw if account does not exist', async () => {
      mockCardRepository.get.mockResolvedValueOnce(true);
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce(undefined);

      await expect(cardService.get({ id: newId }, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should throw if account does not belong to the user', async () => {
      mockCardRepository.get.mockResolvedValueOnce(true);
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce({
        accounts: [{ id: uuidv4() }],
      });

      await expect(cardService.get({ id: newId }, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should return account successfully using parameterId', async () => {
      mockUserWithAccount(completCard.accountId);
      mockCardRepository.get.mockResolvedValueOnce({ ...completCard, id: uuidv4() });

      const result = await cardService.get({ id: newId }, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.cvv).toBe(baseCard.cvv);
      expect(result.number).toBe(baseCard.number);
    });

    it('should return account successfully using parameterNumber', async () => {
      mockUserWithAccount(completCard.accountId);
      mockCardRepository.get.mockResolvedValueOnce({ ...completCard, id: uuidv4() });

      const result = await cardService.get({ number: baseCard.number }, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.cvv).toBe(baseCard.cvv);
      expect(result.number).toBe(baseCard.number);
    });

    it('should return account successfully using parameterAccount', async () => {
      mockUserWithAccount(completCard.accountId);
      mockCardRepository.get.mockResolvedValueOnce({ ...completCard, id: uuidv4() });

      const result = await cardService.get({ number: baseCard.number }, AuthUser);

      expect(result).toHaveProperty('id');
      expect(result.cvv).toBe(baseCard.cvv);
      expect(result.number).toBe(baseCard.number);
    });
  });

  describe('Card - list', () => {
    it('should throw if account does not exist', async () => {
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce(undefined);

      await expect(cardService.list(completCard.accountId, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should throw if user is not the owner of the account', async () => {
      mockAccountRepository.findAccountByUser.mockResolvedValueOnce({
        accounts: [{ id: uuidv4() }],
      });

      await expect(cardService.list(completCard.accountId, AuthUser)).rejects.toThrow(USER_INVALID);
    });

    it('should list all cards successfully', async () => {
      mockUserWithAccount(completCard.accountId);

      mockCardRepository.list.mockResolvedValueOnce([
        { ...completCard, id: newId },
        { ...completCard2, id: uuidv4() },
      ]);

      const result = await cardService.list(completCard.accountId, AuthUser);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('number');
      expect(result[0].id).toBe(newId);
    });
  });

  describe('Card - order', () => {
    it('should throw if itemsPerPage is invalid', async () => {
      await expect(cardService.order({ itemsPerPage: 'j' }, AuthUser)).rejects.toThrow(
        ITEMS_PER_PAGE_ERROR_MESSAGE
      );
    });

    it('should throw if currentPage is invalid', async () => {
      await expect(cardService.order({ currentPage: 'j' }, AuthUser)).rejects.toThrow(
        CURRENT_PAGE_ERROR_MESSAGE
      );
    });

    it('should throw if type is invalid', async () => {
      // @ts-ignore
      await expect(cardService.order({ type: 'test' }, AuthUser)).rejects.toThrow(
        TYPE_ERROR_MESSAGE
      );
    });

    it('should return ordered cards successfully', async () => {
      mockAccountRepository.list.mockResolvedValueOnce([
        { id: completCard.accountId },
        { id: completCard2.accountId },
      ]);
      mockCardRepository.order.mockResolvedValueOnce([
        { ...completCard, id: uuidv4() },
        { ...completCard2, id: uuidv4() },
      ]);

      const result = await cardService.order({}, AuthUser);
      const responseNumber = cardService.formatLastCardNumber(completCard.number);

      expect(Array.isArray(result.cards)).toBe(true);
      expect(result).toHaveProperty('pagination');
      expect(result.cards[0].number).toBe(responseNumber);
    });

    it('should return ordered cards successfully using type', async () => {
      mockAccountRepository.list.mockResolvedValueOnce([
        { id: completCard.accountId },
        { id: completCard2.accountId },
      ]);
      mockCardRepository.order.mockResolvedValueOnce([{ ...completCard, id: uuidv4() }]);

      const result = await cardService.order({ type: CardTypeEnum.physical }, AuthUser);
      const responseNumber = cardService.formatLastCardNumber(completCard.number);
      expect(Array.isArray(result.cards)).toBe(true);
      expect(result.cards.length).toBe(1);
      expect(result.cards[0].type).toBe(CardTypeEnum.physical);
      expect(result).toHaveProperty('pagination');
      expect(result.cards[0].number).toBe(responseNumber);
    });
  });
});
