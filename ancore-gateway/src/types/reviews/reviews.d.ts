import { IProductModel } from '../products/products';

export interface IReviewModel {
  id?: string;
  userId?: string;
  productId?: string;
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewsProduct {
  userReviews: IReviews;
  userProduct: IProductModel;
}

export interface ProductReviews {
  product: IProductModel;
  reviews: IReviews[];
}