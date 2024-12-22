import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';

const { JWT_SECRET = 'secret' } = process.env;

interface Request extends ExpressRequest {
  user?: { id: string };
}

// eslint-disable-next-line consistent-return
const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Неверный формат заголовка авторизации'));
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = payload;
    next();
  } catch (err) {
    console.error('Ошибка верификации токена:', err);
    next(new UnauthorizedError('Необходима авторизация'));
  }
};

export default authMiddleware;
