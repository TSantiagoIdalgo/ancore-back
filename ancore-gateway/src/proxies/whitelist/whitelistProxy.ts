import WhitelistService from '../../services/whitelist/whitelistService';
import GRPCErrorHandler from '../../helpers/error';
import { GraphQLError } from 'graphql';
import { ServerContext } from '../../types/serverTypes';
import { ErrorDefs } from '../../types/error';
import { WhitelistAction } from '../../types/whitelist/whitelist';

export default class WhitelistProxy {
  private readonly whitelistService: WhitelistService;

  constructor(whitelistService: WhitelistService) {
    this.whitelistService = whitelistService;
  }

  public async getAllUserProducts(context: ServerContext) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.whitelistService.getWhitelist(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async addOrRemoveProduct (context: ServerContext, productId: string, action: WhitelistAction) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.UNAUTHENTICATED);
      if (!productId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      if (!action) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      
      switch (action) {
      case 'remove': return await this.whitelistService.removeProduct(userId, productId);
      case 'add': return await this.whitelistService.addProduct(userId, productId);
      default: throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);
      }
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}