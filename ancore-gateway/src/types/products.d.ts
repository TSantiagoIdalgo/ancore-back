export interface IProductModel {
  id: string;
  name: string;
  modelType: string;
  family: string;
  brand: string;
  price: number;
  stock: number;
  disabled: boolean;
  type: string;
  description: string;
  mainImage: string;
  images: string[];
  amount: number;
}