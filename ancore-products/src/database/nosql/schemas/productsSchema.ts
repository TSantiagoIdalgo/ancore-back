import { randomUUID } from 'crypto';
import { IProductModel } from '../../../types/products';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import genreModel from '../../sql/tables/genreModel';

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
  platform: {
    type: String,
    required: true
  },
  developer: {
    type: String,
    required: true
  },
  distributor: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true,
    validate: {
      validator: async (value: string[]) => {
        for (const genre of value) {
          const genreFound = await genreModel.findOne({ where: { genre } });
          if (!genreFound) return false;
        }
        return true;
      },
      message: props => `${props.value} it is not a valid genre`
    }
  },
  score: {
    type: Number,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  mainImage: {
    type: String,
    required: true
  },
  trailer: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    default: 0
  }
});

const ProductSchema = mongoose.model<IProductModel>('Products', product);

export default ProductSchema;