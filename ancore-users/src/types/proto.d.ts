import { ServerUnaryCall, sendUnaryData, ServerWritableStream } from '@grpc/grpc-js';
import { UserId__Output } from '../../proto/out/UserPackage/UserId';
import { User } from '../../proto/out/UserPackage/User';
import { Users } from '../../proto/out/UserPackage/Users';
import { Empty__Output } from '../../proto/out/UserPackage/Empty';
import { UserLogin__Output } from '../../proto/out/UserPackage/UserLogin';
import { UserNetworkLogin__Output } from '../../proto/out/UserPackage/UserNetworkLogin';
import { update__Output } from '../../proto/out/UserPackage/update';
import { UserId__Output } from '../../proto/out/UserPackage/UserId';
import { LoginResponse } from '../../proto/out/UserPackage/LoginResponse';
import { Products } from '../../proto/out/UserPackage/Products';
import { TotalPrice } from '../../proto/out/UserPackage/TotalPrice';
import { Product } from '../../proto/out/UserPackage/Product';
import { UserProductRequest__Output } from '../../proto/out/UserPackage/UserProductRequest';
import { UserFavorites__Output } from '../../proto/out/UserPackage/UserFavorites';


// User proto types
export type getAllRequest = ServerUnaryCall<Empty__Output, Users>
export type getAllResponse = sendUnaryData<Users>

export type getByIdRequest = ServerUnaryCall<UserId__Output, User>
export type getByIdResponse = sendUnaryData<User>

export type loginRequest = ServerUnaryCall<UserLogin__Output, User>
export type loginResponse = sendUnaryData<LoginResponse>

export type networkLoginRequest = ServerUnaryCall<UserNetworkLogin__Output, User>
export type networkLoginResponse = sendUnaryData<LoginResponse>

export type userCreateRequest = ServerUnaryCall<User__Output, User>
export type userCreateResponse = sendUnaryData<User>

export type updateRequest = ServerUnaryCall<update__Output, User>
export type updateResponse = sendUnaryData<User>

export type deleteRequest = ServerUnaryCall<UserId__Output, User>
export type deleteResponse = sendUnaryData<User>

export type verifyRequest = ServerUnaryCall<UserId__Output, User>
export type verifyResponse = sendUnaryData<User>

export type banRequest = ServerUnaryCall<UserId__Output, User>
export type banResponse = sendUnaryData<User>

// UserProducts proto types
export type UserProducts = ServerUnaryCall<UserId__Output, Products>
export type UserProductsResponse = sendUnaryData<Products>

export type UserProductsTotalPrice = ServerWritableStream<UserId__Output, TotalPrice>

export type AddProduct = ServerUnaryCall<UserProductRequest__Output, Product>
export type AddProductResponse = sendUnaryData<Product>

export type RemoveProduct = ServerUnaryCall<UserProductRequest__Output, Product>
export type RemoveProductResponse = sendUnaryData<Product>

export type DeleteProduct = ServerUnaryCall<UserProductRequest__Output, Product>
export type DeleteProductResponse = sendUnaryData<Product>


// WhiteList proto types
export type GetAllWhiteList = ServerUnaryCall<UserId__Output, Products>
export type GetAllWhiteListResponse = sendUnaryData<Products>

export type AddToWhiteList = ServerUnaryCall<UserFavorites__Output, Favorite>
export type AddToWhiteListResponse = sendUnaryData<Favorite>

export type RemoveFromWhiteList = ServerUnaryCall<UserFavorites__Output, Favorite>
export type RemoveFromWhiteListResponse = sendUnaryData<Favorite>