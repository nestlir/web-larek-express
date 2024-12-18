import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

// Получение всех продуктов
export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ items: products, total: products.length });
  } catch (err) {
    next(err as Error);
  }
};

// Создание продукта
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      next(new ConflictError('Продукт с таким названием уже существует'));
      return;
    }

    const newProduct = await Product.create({
      title, image, category, description, price,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    const error = err as Error;
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при создании продукта'));
      return;
    }
    next(error);
  }
};

// Удаление продукта
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      next(new NotFoundError('Продукт с указанным ID не найден'));
      return;
    }

    res.status(200).json({ message: 'Продукт успешно удалён', data: product });
  } catch (err) {
    next(err as Error);
  }
};

// Обновление продукта
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true, // Возвращает обновлённый документ
      runValidators: true, // Проверяет данные перед обновлением
    });

    if (!updatedProduct) {
      next(new NotFoundError('Продукт с указанным ID не найден'));
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    const error = err as Error;
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при обновлении продукта'));
      return;
    }
    next(error);
  }
};
