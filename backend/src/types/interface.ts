import mongoose, { Document } from 'mongoose';

export interface IFile {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  title: string;
  image: IFile;
  category: string;
  description?: string;
  price?: number;
}

export interface OrderRequestBody {
  items: string[]; // Массив ID товаров
  total: number;
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

export interface IOrder extends Document {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: mongoose.Types.ObjectId[];
  orderId: string;
}
