import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';
import config from './config';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';

const app = express();

// Подключение к MongoDB
mongoose.connect(config.dbAddress, {})
  .then(() => {
    console.log('Подключение к MongoDB выполнено успешно');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors({
  origin: config.originAllow,
}));

// Логирование запросов
app.use(requestLogger);

// Роуты приложения
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

// Статичные файлы
app.use(express.static(path.join(__dirname, config.uploadPath)));

// Логирование ошибок
app.use(errorLogger);

// Обработка ошибок Celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
