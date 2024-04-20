import { IProductModel, IProductContent, IProductFilter } from '../../types/products/products';

export interface Paginated {
  size: number;
  page: number;
  filter: IProductFilter
}
  
export interface ProductId {
  productId: string
}
  
export interface ProductInput {
  product: IProductModel;
  content: IProductContent;     
  productId: string;
}
  