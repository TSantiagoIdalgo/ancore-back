import ProductQueryRepository from '../models/products/productQueryRepository';
import ReviewQueryRepository from '../models/review/reviewQueryRepository';
import ReviewQueryService from '../services/reviewService/reviewQueryService';
import ReviewQueryController from '../controllers/reviewController/reviewQueryController';
import ReviewCommandRepository from '../models/review/reviewCommandRepository';
import ReviewCommandService from '../services/reviewService/reviewCommandService';
import ReviewCommandController from '../controllers/reviewController/reviewCommandController';

const productQueryRepository = new ProductQueryRepository();

const reviewQueryRepository = new ReviewQueryRepository();
const reviewQueryService = new ReviewQueryService(reviewQueryRepository, productQueryRepository);

const reviewCommandRepository = new ReviewCommandRepository();
const reviewCommandService = new ReviewCommandService(reviewCommandRepository);

export const reviewQueryController = new ReviewQueryController(reviewQueryService);
export const reviewCommandController = new ReviewCommandController(reviewCommandService);