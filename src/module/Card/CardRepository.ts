import { Cards } from 'generated/prisma';
import prisma from '../../prisma';
import { CreateCardInput } from './dto/create-card.input';
import { CardAlreadyExistInput, GetCardInput } from './dto/get-card.input';
import { PRISMA_ERROR } from '../Utils/ErrorInterface';
import { CardTypeEnum } from './CardEntity';
import { Prisma } from '@prisma/client';

class CardRepository {
  async get(data: GetCardInput): Promise<Cards | any> {
    const { id, accountId, number } = data;
    try {
      const card = await prisma.cards.findFirst({
        where: {
          OR: [{ id }, {accountId}, {number}]
        },
      });
      return card;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async list(accountId: string): Promise<Cards[] | any> {

    try {
      const accounts = await prisma.cards.findMany({
        where: { accountId },
      });
      return accounts;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async getPhysicalCardCount(accountId: string): Promise<number> {
    try {
      const card = await prisma.cards.count({
        where: {
          accountId,
          type: CardTypeEnum.physical
        },
      });
      return card;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async cardAlreadyExist(data: CardAlreadyExistInput): Promise<number> {
    try {
      const card = await prisma.cards.count({
        where: data,
      });
      return card;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async create(data: CreateCardInput): Promise<Cards | any> {
    try {
      const card = await prisma.cards.create({ data });
      return card;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async order(query: Prisma.CardsWhereInput, skip: number, take: number): Promise<Cards[] | any> {
    try {
      const cards = await prisma.cards.findMany({
        where: query,
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' }
      });

      return cards;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }
}

export default CardRepository;
