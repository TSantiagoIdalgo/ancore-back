import ProductGetters from './productGetters';
import GRPCErrorHandler from '../../helpers/error';
import { ErrorDefs } from '../../types/error';
import { GraphQLError } from 'graphql';
import { IProductFilter } from '../../types/products/products';
import { Product__Output } from '../../../proto/out/UserPackage/Product';


export default class ProductService {
  private productGetters: ProductGetters;

  constructor(productGetters: ProductGetters) {
    this.productGetters = productGetters;
  }

  public async getAllProducts (page?: number, size?: number, filter?: IProductFilter): Promise<Product__Output[]> {
    try {
      const products = await this.productGetters.getProducts(page, size, filter);
      if (!products.products) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      if (products.products?.length === 0) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return products.products;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getProduct(id: string): Promise<Product__Output> {
    try {
      if (!id) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      return await this.productGetters.getProduct(id);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getPages (size: number, filter?: IProductFilter) {
    try {
      if (!size || size < 0) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      return await this.productGetters.getPages(size, filter);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }
}