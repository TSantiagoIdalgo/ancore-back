import { IProductModel, IProductContent } from '../../types/products/products';

export interface Paginated {
  size: number;
  page: number
}
  
export interface ProductId {
  productId: string
}
  
export interface ProductInput {
  product: IProductModel;
  content: IProductContent;     
  productId: string;
}
  