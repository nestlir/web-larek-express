import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      items, total, payment, email, phone, address,
    } = req.body;

    if (!items || items.length === 0) {
      next(new BadRequestError('Список товаров не может быть пустым'));
      return;
    }

    const products = await Product.find({ _id: { $in: items } });

    const totalCalculated = products.reduce((sum, product) => sum + (product.price || 0), 0);

    if (totalCalculated !== total) {
      next(new BadRequestError('Сумма заказа не совпадает с расчётной'));
      return;
    }

    const order = {
      id: uuidv4(),
      total,
      payment,
      email,
      phone,
      address,
      items,
    };

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export default createOrder;
