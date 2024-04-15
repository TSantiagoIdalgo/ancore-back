import ProductService from '../../services/products/productService';
import GRPCErrorHandler from '../../helpers/error';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';
import { Product__Output } from '../../../proto/out/UserPackage/Product';
import { IProductModel } from '../../types/products/products';
import { ServerContext } from '../../types/serverTypes';
import { allowMethod } from '../../helpers/decorators/allowMethod';

export default class ProductProxy {
  private readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  public async getAllProducts(page?: number, size?: number): Promise<Product__Output[]> {
    try {
      if ((page as number) <= 0 || (size as number) <= 0) {
        throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      } 

      const products = await this.productService.getAllProducts(page, size);
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

  public async getTotalPages (size: number): Promise<number> {
    try {
      if (!size) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      const pages = await this.productService.getPages(size);
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

  @allowMethod()
  public async updateProduct(context: ServerContext, productId: string, product: IProductModel) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      if (!productId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.productService.updateProduct(productId, product);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @allowMethod()
  public async deleteProduct (context: ServerContext, productId: string) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      if (!productId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.productService.deleteProduct(productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}