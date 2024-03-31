import { ProtoGrpcType } from '../proto/out/products';
import { ProductsServiceHandlers } from '../proto/out/ProductsPackage/ProductsService';
import { ReviewsServiceHandlers } from '../proto/out/ProductsPackage/ReviewsService';
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
}

export default server;