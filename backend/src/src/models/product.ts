import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  title: string;
  image: { fileName: string; originalName: string };
  category: string;
  description?: string;
  price?: number;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: {
    type: {
      fileName: { type: String, required: true },
      originalName: { type: String, required: true },
    },
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('Product', productSchema);
