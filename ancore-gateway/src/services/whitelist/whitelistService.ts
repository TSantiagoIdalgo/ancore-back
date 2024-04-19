import { GraphQLError } from 'graphql';
import GRPCErrorHandler from '../../helpers/error';
import WhitelistGetter from './whitelistGetter';
import WhitelistSetter from './whitelistSetter';
import { ErrorDefs } from '../../types/error';

export default class WhitelistService {
  private readonly whitelistGetter: WhitelistGetter;
  private readonly whitelistSetter: WhitelistSetter;

  constructor(whitelistGetter: WhitelistGetter, whitelistSetter: WhitelistSetter) {
    this.whitelistGetter = whitelistGetter;
    this.whitelistSetter = whitelistSetter;
  }

  public async getWhitelist(userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      const whitelist = await this.whitelistGetter.getWhitelist(userId);
      if (!whitelist.products) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return whitelist.products;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async addProduct(userId: string, productId: string) {
    try {
      if (!userId || !productId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      return await this.whitelistSetter.addProduct(userId, productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async removeProduct(userId: string, productId: string) {
    try {
      if (!userId || !productId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      return await this.whitelistSetter.removeProduct(userId, productId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }
}