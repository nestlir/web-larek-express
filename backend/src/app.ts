import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
<<<<<<< Updated upstream
=======
import helmet from 'helmet';
>>>>>>> Stashed changes
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import config from './config';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import routes from './routes';

<<<<<<< Updated upstream
const app = express();

=======
>>>>>>> Stashed changes
// Подключение к MongoDB
mongoose.connect(process.env.DB_ADDRESS!)
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.error('Ошибка подключения к базе данных:', err));

<<<<<<< Updated upstream
=======
const app = express();

>>>>>>> Stashed changes
// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors({
  origin: config.originAllow,
}));

<<<<<<< Updated upstream
// Логирование запросов
app.use(requestLogger);

=======
>>>>>>> Stashed changes
// Лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Лимит запросов
<<<<<<< Updated upstream
=======
  standardHeaders: true, // Возвращать лимиты в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
>>>>>>> Stashed changes
  message: 'Слишком много запросов, попробуйте позже.',
});
app.use(limiter);

<<<<<<< Updated upstream
// Подключение роутов
app.use('/', routes);

// Статичные файлы
app.use(express.static(path.join(__dirname, config.uploadPath)));
=======
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
  console.log(`App listening on port ${config.port}`);
=======
  console.log(`Сервер запущен на порту ${config.port}`);
>>>>>>> Stashed changes
});
