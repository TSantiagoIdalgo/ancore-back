import { PagesResponse__Output } from '../../../proto/out/ProductsPackage/PagesResponse';
import { ProductsServiceClient } from '../../../proto/out/ProductsPackage/ProductsService';
import { Product__Output } from '../../../proto/out/UserPackage/Product';
import { Products__Output } from '../../../proto/out/UserPackage/Products';
import GRPCErrorHandler from '../../helpers/error';

export default class ProductGetters {
  private readonly client: ProductsServiceClient;

  constructor(client: ProductsServiceClient) {
    this.client = client;
  }

  public getProducts(page?: number, size?: number): Promise<Products__Output> {
    return new Promise<Products__Output>((res, rej) => {
      this.client.getAllProducts({ page, size }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public getProduct(productId: string): Promise<Product__Output> {
    return new Promise<Product__Output>((res, rej) => {
      this.client.getProductById({ productId }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public getPages (size: number): Promise<PagesResponse__Output> {
    return new Promise<PagesResponse__Output>((res, rej) => {
      this.client.getTotalPages({ size }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }
}