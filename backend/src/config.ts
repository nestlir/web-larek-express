import dotenv from 'dotenv';

// Загружаем переменные окружения из .env
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbAddress: process.env.DB_ADDRESS || 'mongodb://localhost:27017/weblarek',
  originAllow: process.env.ORIGIN_ALLOW || 'http://localhost:3000',
};

export default config;
