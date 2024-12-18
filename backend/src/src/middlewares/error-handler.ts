import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): Response => {
  // Обработка ошибок celebrate
  if (isCelebrateError(err)) {
    const errorDetail = err.details.get('body') || err.details.get('params');
    if (errorDetail) {
      return res.status(400).json({ message: errorDetail.message });
    }
  }

  // Общая обработка ошибок
  const { statusCode = 500, message } = err;
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : message,
  });
};

export default errorHandler;
