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
  // Логирование ошибок для отладки (в продакшене можно отключить)
<<<<<<< Updated upstream
  console.error('Ошибка:', err);
=======
  if (process.env.NODE_ENV !== 'production') {
    console.error('Ошибка:', err);
  }
>>>>>>> Stashed changes

  // Обработка ошибок celebrate
  if (isCelebrateError(err)) {
    const errorDetail = err.details.get('body')
      || err.details.get('params')
      || err.details.get('headers')
      || err.details.get('query');
    if (errorDetail) {
      return res.status(400).json({ message: errorDetail.message });
    }
<<<<<<< Updated upstream
  }

  // Общая обработка ошибок
  const { statusCode = 500, message = 'Internal server error' } = err;

  // Если это неизвестная ошибка, логируем детали
  if (statusCode === 500 && !message) {
    console.error('Неизвестная ошибка:', err);
  }

=======
    return res.status(400).json({ message: 'Ошибка валидации данных' });
  }

  // Обработка кастомных ошибок
  const { statusCode = 500, message = 'Internal server error' } = err;

  // Если это неизвестная ошибка, логируем детали
  if (!(err instanceof Error)) {
    console.error('Неизвестная ошибка:', err);
    return res.status(500).json({ message: 'Произошла неизвестная ошибка' });
  }

  // Возврат стандартного ответа
>>>>>>> Stashed changes
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : message,
  });
};

export default errorHandler;
