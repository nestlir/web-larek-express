import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IOrder } from '../types/interface';

const orderSchema = new Schema<IOrder>(
  {
    payment: {
      type: String,
      required: true,
      enum: ['card', 'online'],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format',
      },
      index: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\+7\d{10}$/.test(v),
        message: 'Invalid phone number format',
      },
    },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOrder>('Order', orderSchema);
