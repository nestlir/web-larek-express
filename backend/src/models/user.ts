import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (value: string) => /\S+@\S+\.\S+/.test(value),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [6, 'Минимальная длина пароля - 6 символов'],
    select: false,
  },
  tokens: {
    type: [{ token: { type: String, required: true } }],
    select: false,
  },
});

export default mongoose.model<IUser>('User', userSchema);
