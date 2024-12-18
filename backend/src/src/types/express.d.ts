import Request from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Или другой тип, соответствующий `payload`
        [key: string]: any; // Если payload имеет дополнительные свойства
      };
    }
  }
}
