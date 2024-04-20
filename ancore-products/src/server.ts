import { ProtoGrpcType } from '../proto/out/products';
import { ProductsServiceHandlers } from '../proto/out/ProductsPackage/ProductsService';
import { ReviewsServiceHandlers } from '../proto/out/ProductsPackage/ReviewsService';
import { GenreServiceHandlers } from '../proto/out/ProductsPackage/GenreService';
import { BannerServiceHandlers } from '../proto/out/ProductsPackage/BannerService';
import path from 'path';
import * as handlers from './config/handlersConfig';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const server = new grpc.Server();

const PROTO_PATH = '../proto/products.proto';
const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_PATH));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
const productPackage = grpcObj.ProductsPackage;

export function ServerHandlers () {
  server.addService(productPackage.ProductsService.service, {
    getAllProducts: (req, res) => { handlers.productQueryController.getAllProduct(req, res); },
    getProductById: (req, res) => { handlers.productQueryController.getProductById(req, res); },
    getTotalPages: (req, res) => { handlers.productQueryController.getTotalPages(req, res); },
    
    createProduct: (req, res) => { handlers.productCommandController.createProduct(req, res); },
    updateProduct: (req, res) => { handlers.productCommandController.updateProduct(req, res); },
    deleteProduct: (req, res) => { handlers.productCommandController.deleteProduct(req, res); },
  } as ProductsServiceHandlers);

  server.addService(productPackage.ReviewsService.service, {
    getAllReviews: (req, res) => { handlers.reviewQueryController.getAllReviews(req, res); },
    getReviewById: (req, res) => { handlers.reviewQueryController.getReviewById(req, res); },
    getProductsReviews: (req, res) => { handlers.reviewQueryController.getProductReviews(req, res); },
    getUserReviews: (req, res) => { handlers.reviewQueryController.getUserReviews(req, res); },

    createReview: (req, res) => { handlers.reviewCommandController.createReview(req, res); },
    updateReview: (req, res) => { handlers.reviewCommandController.updateReview(req, res); },
    deleteReview: (req, res) => { handlers.reviewCommandController.deleteReview(req, res); },
  } as ReviewsServiceHandlers);


  server.addService(productPackage.GenreService.service, {
    getAllGenres: (req, res) => { handlers.genreController.getAllGenres(req, res); },
    getGenreById: (req, res) => { handlers.genreController.getGenreById(req, res); },
    createGenre: (req, res) => { handlers.genreController.createGenre(req, res); },
    deleteGenre: (req, res) => { handlers.genreController.deleteGenre(req, res); },
  } as GenreServiceHandlers);

  server.addService(productPackage.BannerService.service, {
    getAllBanners: (req, res) => { handlers.bannerController.getAllBanner(req, res); },
    getBannerById: (req, res) => { handlers.bannerController.getBannerById(req, res); },

    createBanner: (req, res) => { handlers.bannerController.createBanner(req, res); },
    deleteBanner: (req, res) => { handlers.bannerController.deleteBanner(req, res); },
    updateBanner: (req, res) => { handlers.bannerController.updateBanner(req, res); },
  } as BannerServiceHandlers);
}

export default server;