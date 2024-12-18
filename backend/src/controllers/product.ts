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
    console.error('Ошибка при получении продуктов:', err); // Логирование ошибки
    next(err);
  }
};

// Создание продукта
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;

    if (!title || !image || !category) {
      throw new BadRequestError('Обязательные поля: title, image и category должны быть заполнены');
    }

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      throw new ConflictError('Продукт с таким названием уже существует');
    }

    const newProduct = await Product.create({
      title, image, category, description, price,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    if (err instanceof Error) { // Проверка типа ошибки
      console.error('Ошибка при создании продукта:', err.message);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании продукта'));
      } else {
        next(err);
      }
    } else {
      console.error('Неизвестная ошибка:', err);
      next(new Error('Произошла неизвестная ошибка'));
    }
  }
};

// Удаление продукта
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new NotFoundError('Продукт с указанным ID не найден');
    }

    res.status(200).json({ message: 'Продукт успешно удалён', data: product });
  } catch (err) {
    console.error('Ошибка при удалении продукта:', err); // Логирование ошибки
    next(err);
  }
};

// Обновление продукта
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Проверка на пустое значение "title"
    if (updateData.title === '') {
      throw new BadRequestError('Поле "title" не может быть пустым');
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true, // Возвращает обновлённый документ
      runValidators: true, // Проверяет данные перед обновлением
    });

    if (!updatedProduct) {
      throw new NotFoundError('Продукт с указанным ID не найден');
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Ошибка при обновлении продукта:', err);

    // Проверяем тип ошибки
    if (err instanceof Error) {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновлении продукта'));
      } else {
        next(err);
      }
    } else {
      next(new Error('Произошла неизвестная ошибка'));
    }
  }
};
