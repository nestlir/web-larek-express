import winston from 'winston';
import expressWinston from 'express-winston';

export const requestLogger = expressWinston.logger({
<<<<<<< Updated upstream
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
    new winston.transports.Console(), // Для разработки
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
});

// Логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
    new winston.transports.Console(), // Для разработки
  ],
=======
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
>>>>>>> Stashed changes
  format: winston.format.json(),
});
