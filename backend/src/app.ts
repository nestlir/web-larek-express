import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import config from './config';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import routes from './routes';

// Подключение к MongoDB
mongoose.connect(config.dbAddress)
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.error('Ошибка подключения к базе данных:', err));

const app = express();

// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors({
  origin: config.originAllow,
}));

// Лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Лимит запросов
  standardHeaders: true, // Возвращать лимиты в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
  message: 'Слишком много запросов, попробуйте позже.',
});
app.use(limiter);

// Использование Helmet для защиты
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", "'unsafe-eval'"],
    },
  },
}));

// Логирование запросов
app.use(requestLogger);

// Подключение маршрутов
app.use('/', routes);

// Раздача статичных файлов
app.use('/images', express.static(path.join(process.cwd(), 'src/public/images')));

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
  console.log(`Сервер запущен на порту ${config.port}`);
});
