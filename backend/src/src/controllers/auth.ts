import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

const {
  JWT_SECRET = 'secret',
  AUTH_REFRESH_TOKEN_EXPIRY = '7d',
  AUTH_ACCESS_TOKEN_EXPIRY = '10m',
} = process.env;

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { _id: userId },
    JWT_SECRET,
    { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY },
  );
  const refreshToken = jwt.sign(
    { _id: userId },
    JWT_SECRET,
    { expiresIn: AUTH_REFRESH_TOKEN_EXPIRY },
  );
  return { accessToken, refreshToken };
};

// Регистрация пользователя
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new ConflictError('Пользователь с таким email уже существует'));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const { accessToken, refreshToken } = generateTokens(String(newUser._id).toString());

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 604800000, // 7 дней
      })
      .status(201)
      .json({
        user: { email: newUser.email, name: newUser.name },
        success: true,
        accessToken,
      });
  } catch (err) {
    next(err as Error);
  }
};

// Авторизация пользователя
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const { accessToken, refreshToken } = generateTokens(String(String(user._id)).toString());

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 604800000, // 7 дней
      })
      .status(200)
      .json({
        user: { email: user.email, name: user.name },
        success: true,
        accessToken,
      });
  } catch (err) {
    next(err as Error);
  }
};

// Получение текущего пользователя
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { _id } = req.user as { _id: string };
    const user = await User.findById(_id);

    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    res.status(200).json({ user: { email: user.email, name: user.name }, success: true });
  } catch (err) {
    next(err as Error);
  }
};

// Обновление токенов
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      next(new UnauthorizedError('Необходима авторизация'));
      return;
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET) as { _id: string };

    const user = await User.findById(payload._id);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    // Здесь удаляем refresh-токен из БД (если реализовано хранение)
    res
      .cookie('refreshToken', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 0, // Устанавливаем истёкший срок
      })
      .status(200)
      .json({ success: true });
  } catch (err) {
    next(err as Error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      next(new UnauthorizedError('Необходима авторизация'));
      return;
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET) as { _id: string };

    const user = await User.findById(payload._id);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    const
      {
        accessToken,
        refreshToken:
      newRefreshToken,
      } = generateTokens(String(String(user._id)).toString());

    res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 604800000, // 7 дней
      })
      .status(200)
      .json({
        user: { email: user.email, name: user.name },
        success: true,
        accessToken,
      });
  } catch (err) {
    next(err as Error);
  }
};
