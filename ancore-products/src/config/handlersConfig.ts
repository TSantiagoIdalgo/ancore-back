import ProductQueryRepository from '../models/products/productQueryRepository';
import ProductQueryService from '../services/productService/productQueryService';
import ProductQueryController from '../controllers/productController/productQueryController';
import ReviewQueryRepository from '../models/review/reviewQueryRepository';
import ReviewQueryService from '../services/reviewService/reviewQueryService';
import ReviewQueryController from '../controllers/reviewController/reviewQueryController';
import ReviewCommandRepository from '../models/review/reviewCommandRepository';
import ReviewCommandService from '../services/reviewService/reviewCommandService';
import ReviewCommandController from '../controllers/reviewController/reviewCommandController';
import ProductCommandRepository from '../models/products/productCommandRepository';
import ProductCommandService from '../services/productService/productCommandService';
import ProductCommandController from '../controllers/productController/productCommandController';

const productQueryRepository = new ProductQueryRepository();
const productCommandRepository = new ProductCommandRepository();

const productQueryService = new ProductQueryService(productQueryRepository);
const productCommandService = new ProductCommandService(productCommandRepository);

const reviewQueryRepository = new ReviewQueryRepository();
const reviewCommandRepository = new ReviewCommandRepository();

const reviewQueryService = new ReviewQueryService(reviewQueryRepository, productQueryRepository);
const reviewCommandService = new ReviewCommandService(reviewCommandRepository);

export const productQueryController = new ProductQueryController(productQueryService);
export const productCommandController = new ProductCommandController(productCommandService);
export const reviewQueryController = new ReviewQueryController(reviewQueryService);
export const reviewCommandController = new ReviewCommandController(reviewCommandService);