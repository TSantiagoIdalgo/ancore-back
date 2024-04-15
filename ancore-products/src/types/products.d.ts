import { Document } from 'mongoose';

export interface IProductModel {
  id?: string;
  name: string;
  price: number;
  stock: number;
  disabled: boolean;
  platform: string;
  score: number
  distributor: string;
  developer: string;
  genre: string
  description: string;
  trailer?: string;
  mainImage: string;
  images: string[];
  discount: number;
  amount?: number;
}

export interface IProducts extends Document<IProductModel>, IProductModel {}