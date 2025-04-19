import { Users } from 'generated/prisma';
import prisma from '../../prisma';
import { CreateUserInput } from './dto/create-user.input';
import { GetUserInput } from './dto/get-user.input';
import { PRISMA_ERROR } from '../Utils/ErrorInterface';

class UserRepository {
  async get(data: GetUserInput): Promise<Users | any> {
    const { id, document } = data;
    try {
      const user = await prisma.users.findFirst({
        where: {
          OR: [{ id }, { document }],
        },
      });
      return user;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async userAccount(id: string): Promise<Users | any> {
    try {
      const user = await prisma.users.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          document: true,
          role: true,
          accounts: {
            select: {
              id: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async create(data: CreateUserInput): Promise<Users | any> {
    try {
      const user = await prisma.users.create({ data });
      return user;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }

  async order(query: any, skip: number, take: number): Promise<Users[] | any> {
    try {
      const users = await prisma.users.findMany({
        where: query,
        skip: skip,
        take: take,
        select: {
          id: true,
          name: true,
          document: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return users;
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(PRISMA_ERROR);
    }
  }
}

export default UserRepository;
