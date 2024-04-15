import { ProductsServiceClient } from '../../../proto/out/ProductsPackage/ProductsService';
import { Product__Output } from '../../../proto/out/UserPackage/Product';
import GRPCErrorHandler from '../../helpers/error';
import { IProductModel } from '../../types/products/products';

export default class ProductSetters {
  private readonly client: ProductsServiceClient;

  constructor(client: ProductsServiceClient) {
    this.client = client;
  }

  public async create(product: IProductModel): Promise<Product__Output> {
    return new Promise<Product__Output>((res, rej) => {
      console.log(product);
      this.client.createProduct({ ...product}, (err, result) => {
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

  public async update(productId: string, product: IProductModel): Promise<Product__Output> {
    return new Promise<Product__Output>((res, rej) => {
      this.client.updateProduct({ productId, product }, (err, result) => {
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

  public async delete(productId: string): Promise<Product__Output> {
    return new Promise<Product__Output>((res, rej) => {
      this.client.deleteProduct({ productId }, (err, result) => {
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