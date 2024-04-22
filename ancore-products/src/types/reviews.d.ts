import { Model } from 'sequelize';
import { IProducts } from './products';

export interface IReviewModel {
  id?: string;
  userId?: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface ReviewsProduct {
  userReviews: IReviews;
  userProduct: IProducts;
}

export interface ProductReviews {
  reviews: IReviewModel[];
}

export interface IReviews extends Model<IReviewModel>, IReviewModel {}