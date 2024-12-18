import { Document } from 'mongoose';

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
