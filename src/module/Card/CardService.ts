import AccountService from '../Account/AccountService';
import { CustomJwtPayload } from '../User/UserEntity';
import UserService from '../User/UserService';
import { Pagination } from '../utils/PaginationInterface';
import { createError, paginate, setPagination } from '../utils/UtilsService';
import { ALREADY_USED_PHYSICAL_CARD, CARD_ALREADY_EXIST, CARD_NOT_FOUND } from './CardConstants';
import { CardOrderInterface, Cards, CardTypeEnum } from './CardEntity';
import CardRepository from './CardRepository';
import CardValidate from './CardValdiate';
import { CreateCardInput } from './dto/create-card.input';
import { GetCardInput, TransactionPagination } from './dto/get-card.input';

class CardService {
  private readonly cardRepository: CardRepository;
  private readonly cardValidate: CardValidate;

  constructor() {
    this.cardRepository = new CardRepository();
    this.cardValidate = new CardValidate();
  }

  public async create(data: CreateCardInput, user: CustomJwtPayload): Promise<Cards> {
    this.cardValidate.validateCreateCard(data);

    try {
      const { id } = user;
      const { type, number, accountId } = data;

      const formatedCardNumber = this.formatCardNumber(number);
      await AccountService.validateUserAccounts(accountId, id);

      const cardAlreadyExist = await this.cardRepository.cardAlreadyExist({
        ...data,
        number: formatedCardNumber,
      });

      if (cardAlreadyExist) throw createError(CARD_ALREADY_EXIST, 409);

      if (type === CardTypeEnum.physical) {
        const isPhysicalCard = await this.cardRepository.getPhysicalCardCount(accountId);
        if (isPhysicalCard) throw createError(ALREADY_USED_PHYSICAL_CARD, 409);
      }

      let card: Cards | any = await this.cardRepository.create({
        ...data,
        number: formatedCardNumber,
      });

      card.number = this.formatLastCardNumber(card.number);

      return card;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async list(accountId: string, user: CustomJwtPayload): Promise<Cards[]> {
    try {
      const { id } = user;

      await AccountService.validateUserAccounts(accountId, id);

      const cards = await this.cardRepository.list(accountId);

      return cards;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async get(data: GetCardInput, user: CustomJwtPayload): Promise<Cards> {
    this.cardValidate.validateGetCard(data);

    const { id } = user;
    let { number } = data;

    if (number) number = this.formatCardNumber(number);

    try {
      const card = await this.cardRepository.get({ ...data, number });

      if (!card) throw createError(CARD_NOT_FOUND, 409);

      await AccountService.validateUserAccounts(card.accountId, id);

      return card;
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  public async order(query: TransactionPagination, user: CustomJwtPayload): Promise<CardOrderInterface> {
    this.cardValidate.validateOrder(query);

    try {
      const { type } = query;
      const { skip, take } = setPagination(query);

      const userAccounts = await AccountService.list(user);
      const accountsIds: string[] = userAccounts.map((it) => it.id) ?? [];

      const currentPage = Math.floor(skip / take) + 1;

      const where: any = { accountId: { in: accountsIds } }

      if (type) where.type = type;

      let cards = await this.cardRepository.order(where, skip, take);

      if (cards.length) {
        cards = cards.map((card) => ({
          ...card,
          number: this.formatLastCardNumber(card.number),
        }));
      }

      const pagination = paginate(take, currentPage);

      return { cards, pagination };
    } catch (error: any) {
      const status = error.status ? error.status : 500;
      throw createError(error.message, status);
    }
  }

  private formatCardNumber(input: string): string {
    const cleaned = input.replace(/\s/g, '');

    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  public formatLastCardNumber(input: string): string {
    const numberSplited = input.split(' ');

    return numberSplited[3];
  }
}

export default new CardService();
