import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import config from './config';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import routes from './routes';

const app = express();

// Подключение к MongoDB
mongoose.connect(process.env.DB_ADDRESS!)
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.error('Ошибка подключения к базе данных:', err));

// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors({
  origin: config.originAllow,
}));

// Логирование запросов
app.use(requestLogger);

// Лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Лимит запросов
  message: 'Слишком много запросов, попробуйте позже.',
});
app.use(limiter);

// Подключение роутов
app.use('/', routes);

// Статичные файлы
app.use(express.static(path.join(__dirname, config.uploadPath)));

// Логирование ошибок
app.use(errorLogger);

// Обработка ошибок Celebrate
app.use(errors());

// Обработка запросов на несуществующие маршруты
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
