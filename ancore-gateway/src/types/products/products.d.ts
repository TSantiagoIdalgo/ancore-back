export interface IProductModel {
  id?: string;
  name: string;
  price: number;
  stock: number;
  discount: number;
  disabled: boolean;
  platform: string;
  score: number
  distributor: string;
  developer: string;
  genre: string[];
  description: string;
  trailer?: string;
  mainImage: string;
  images: string[];
  amount?: number
}

export interface IProductContent {
  trailer: File;
  mainImage: File;
  images: File[]; 
}

export interface IProductFilter {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  platform?: string;
  score?: number;
  genre?: string[];
  discount?: number;
}