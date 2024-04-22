import ProductService from '../../services/products/productService';
import GRPCErrorHandler from '../../helpers/error';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';
import { Product__Output } from '../../../proto/out/UserPackage/Product';
import { IProductFilter } from '../../types/products/products';

export default class ProductProxy {
  private readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  public async getAllProducts(page?: number, size?: number, filter?: IProductFilter): Promise<Product__Output[]> {
    try {
      if ((page as number) <= 0 || (size as number) <= 0) {
        throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      } 

      const products = await this.productService.getAllProducts(page, size, filter);
      if (!products || products.length === 0) {
        throw new GraphQLError(ErrorDefs.NOT_FOUND, {
          extensions: { code: 404 }
        });
      }

      return products;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getProductById(productId: string) {
    try {
      if (!productId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.productService.getProduct(productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getTotalPages (size: number, filter?: IProductFilter): Promise<number> {
    try {
      if (!size) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      const pages = await this.productService.getPages(size, filter);
      if (!pages.totalPages) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);
      if (pages.totalPages === 0) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);
      return pages.totalPages;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}