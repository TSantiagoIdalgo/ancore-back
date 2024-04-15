import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { Empty__Output } from '../../proto/out/ProductsPackage/Empty';
import { Products } from '../../proto/out/ProductsPackage/Products';
import { Product } from '../../proto/out/ProductsPackage/Product';
import { ProductId__Output } from '../../proto/out/ProductsPackage/ProductId';
import { Product__Output } from '../../proto/out/ProductsPackage/Product';
import { UpdateProduct__Output } from '../../proto/out/ProductsPackage/UpdateProduct';

import { Reviews } from '../../proto/out/ProductsPackage/Reviews';
import { Review } from '../../proto/out/ProductsPackage/Review';
import { Review__Output } from '../../proto/out/ProductsPackage/Review';
import { ReviewFromProduct } from '../../proto/out/ProductsPackage/ReviewFromProduct';
import { UserReviews } from '../../proto/out/ProductsPackage/UserReviews';
import { ReviewId__Output } from '../../proto/out/ProductsPackage/ReviewId';
import { UpdateReview__Output } from '../../proto/out/ProductsPackage/UpdateReview';
import { UserId__Output } from '../../proto/out/ProductsPackage/UserId';
import { Products } from '../../proto/out/ProductsPackage/Products';
import { ProductPaginate__Output } from '../../proto/out/ProductsPackage/ProductPaginate';
import { Size__Output } from '../../proto/out/ProductsPackage/Size';
import { PagesResponse } from '../../proto/out/ProductsPackage/PagesResponse';


// Product proto types
export type TGetAllProducts = ServerUnaryCall<ProductPaginate__Output, Products>
export type TGetAllProductsResponse = sendUnaryData<Products>

export type TGetAllPages = ServerUnaryCall<Size__Output, Products>
export type TGetAllPagesResponse = sendUnaryData<PagesResponse>

export type TGetProductById = ServerUnaryCall<ProductId__Output, Product>
export type TGetProductByIdResponse = sendUnaryData<Product>

export type TCreateProduct = ServerUnaryCall<Product__Output, Product>
export type TCreateProductResponse = sendUnaryData<Product>

export type TUpdateProduct = ServerUnaryCall<UpdateProduct__Output, Product>
export type TUpdateProductResponse = sendUnaryData<Product>

export type TDeleteProduct = ServerUnaryCall<ProductId__Output, Product>
export type TDeleteProductResponse = sendUnaryData<Product>

// Reviews proto types
export type TGetAllReviews = ServerUnaryCall<Empty__Output, Reviews>
export type TGetAllReviewsResponse = sendUnaryData<Reviews>

export type TGetProductReviews = ServerUnaryCall<ProductId__Output, ReviewFromProduct>
export type TGetProductReviewsResponse = sendUnaryData<ReviewFromProduct>

export type TGetReviewById = ServerUnaryCall<ReviewId__Output, Review>
export type TGetReviewByIdResponse = sendUnaryData<Review>

export type TGetUserReviews = ServerUnaryCall<UserId__Output, UserReviews>
export type TGetUserReviewsResponse = sendUnaryData<UserReviews>

export type TCreateReview = ServerUnaryCall<Review__Output, Review>
export type TCreateReviewResponse = sendUnaryData<Review>

export type TDeleteReview = ServerUnaryCall<ReviewId__Output, Review>
export type TDeleteReviewResponse = sendUnaryData<Review>

export type TUpdateReview = ServerUnaryCall<UpdateReview__Output, Review>
export type TUpdateReviewResponse = sendUnaryData<Review>
 
