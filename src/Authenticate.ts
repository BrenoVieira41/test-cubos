import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { CustomJwtPayload, Users } from './module/User/UserEntity';
import { CustomError } from './module/Utils/ErrorInterface';

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const secret = process.env.JWT_SECRET || 'secret';

  if (!authorization) {
    res.status(401).json({ message: ['Token inválido ou expirado.'] });
    return;
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = verify(token, secret) as CustomJwtPayload;
    req.user = data as Users;

    return next();
  } catch (error: CustomError | any) {
    console.error(error);
    res.status(error.status || 403).json({ message: ['Token inválido.'] });
    return;
  }
}
