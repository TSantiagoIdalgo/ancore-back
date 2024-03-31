import { randomUUID } from 'crypto';
import { IUserCart } from '../../../types/userCart';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const UserCart = new Schema<IUserCart>({
  id: { type: String, default: randomUUID() },
  userId: { type: String, required: true },
  total: { type: Number, required: true },
  products: [{ productId: String, amount: Number }]
});

const UserCartSchema = mongoose.model<IUserCart>('UserCart', UserCart);

export default UserCartSchema;