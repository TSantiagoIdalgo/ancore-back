import { randomUUID } from 'crypto';
import { IProductModel } from '../../../types/products';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const product = new Schema<IProductModel>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: randomUUID()
  },
  name: {
    type: String,
    required: true
  },
  modelType: {
    type: String,
    required: true
  },
  family: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  mainImage: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: false
  },
  amount: {
    type: Number,
    default: 1
  }
});

const ProductSchema = mongoose.model<IProductModel>('Products', product);

export default ProductSchema;