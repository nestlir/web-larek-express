import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import { validateOrderBody } from '../middlewares/validations'; // Импорт валидации
import { OrderRequestBody } from '../types/interface';

const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Валидируем входные данные
    await validateOrderBody(req, res, next);

    const {
      items, total, payment, email, phone, address,
    }: OrderRequestBody = req.body;

    console.log('Получен запрос на создание заказа');

    // Проверка существования товаров
    const products = await Product.find({ _id: { $in: items } });

    const foundProductIds = products.map((product) => String(product._id));
    const missingProducts = items.filter((item) => !foundProductIds.includes(item));

    if (missingProducts.length > 0) {
      throw new BadRequestError(`Следующие товары не найдены в базе данных: ${missingProducts.join(', ')}`);
    }

    // Проверка расчётной суммы заказа
    const totalCalculated = products.reduce((sum, product) => {
      if (!product.price) {
        throw new BadRequestError(`У товара с ID ${product._id} отсутствует цена`);
      }
      return sum + product.price;
    }, 0);

    if (totalCalculated !== total) {
      throw new BadRequestError('Сумма заказа не совпадает с расчётной');
    }

    // Создание объекта заказа
    const order = {
      id: uuidv4(),
      total,
      payment,
      email,
      phone,
      address,
      items,
    };

    console.log('Заказ успешно создан:', order);

    // Возврат успешного ответа
    res.status(201).json(order);
  } catch (err) {
    console.error('Ошибка при создании заказа:', err);

    if (err instanceof Error) {
      next(err);
    } else {
      next(new Error('Произошла неизвестная ошибка'));
    }
  }
};

export default createOrder;
