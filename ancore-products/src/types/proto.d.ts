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
import { ProductsReviews } from '../../proto/out/ProductsPackage/ProductsReviews';
import { UserReviews } from '../../proto/out/ProductsPackage/UserReviews';
import { ReviewId__Output } from '../../proto/out/ProductsPackage/ReviewId';
import { UpdateReview__Output } from '../../proto/out/ProductsPackage/UpdateReview';
import { UserId__Output } from '../../proto/out/ProductsPackage/UserId';
import { Products } from '../../proto/out/ProductsPackage/Products';
import { ProductPaginate__Output } from '../../proto/out/ProductsPackage/ProductPaginate';
import { Size__Output } from '../../proto/out/ProductsPackage/Size';
import { PagesResponse } from '../../proto/out/ProductsPackage/PagesResponse';

import { Genres } from '../../proto/out/ProductsPackage/Genres';
import { Genre } from '../../proto/out/ProductsPackage/Genre';
import { GenreId__Output } from '../../proto/out/ProductsPackage/GenreId';
import { Genre__Output } from '../../proto/out/ProductsPackage/Genre';
import { Banners } from '../../proto/out/ProductsPackage/Banners';
import { BannerId__Output } from '../../proto/out/ProductsPackage/BannerId';
import { BannerData } from './banner';
import { Banner__Output } from '../../proto/out/ProductsPackage/Banner';
import { UpdateBanner__Output } from '../../proto/out/ProductsPackage/UpdateBanner';

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

export type TGetProductReviews = ServerUnaryCall<ProductId__Output, ProductsReviews>
export type TGetProductReviewsResponse = sendUnaryData<ProductsReviews>

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
 
// Genre proto types 

export type TGetGenres = ServerUnaryCall<Empty__Output, Genres>
export type TGetGenresResponse = sendUnaryData<Genres>

export type TGetGenre = ServerUnaryCall<GenreId__Output, Genre>
export type TGetGenreResponse = sendUnaryData<Genre>

export type TCreateGenre = ServerUnaryCall<Genre__Output, Genre>
export type TCreateGenreResponse = sendUnaryData<Genre>

export type TDeleteGenre = ServerUnaryCall<GenreId__Output, Genre>
export type TDeleteGenreResponse = sendUnaryData<Genre>

// Banner proto types 

export type TGetBanners = ServerUnaryCall<Empty__Output, Banners>
export type TGetBannersResponse = sendUnaryData<Banners>

export type TGetBanner = ServerUnaryCall<BannerId__Output, BannerData>
export type TGetBannerResponse = sendUnaryData<BannerData>

export type TCreateBanner = ServerUnaryCall<Banner__Output, BannerData>
export type TCreateBannerResponse = sendUnaryData<BannerData>

export type TDeleteBanner = ServerUnaryCall<BannerId__Output, BannerData>
export type TDeleteBannerResponse = sendUnaryData<BannerData>

export type TUpdateBanner = ServerUnaryCall<UpdateBanner__Output, BannerData>
export type TUpdateBannerResponse = sendUnaryData<BannerData>