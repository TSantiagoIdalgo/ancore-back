import CartService from '../../services/cart/cartService';
import GRPCErrorHandler from '../../helpers/error';
import { pubSub } from '../../resolvers/cart/cartResolver';
import { CartEvents } from '../../types/cart/userCart';
import { ErrorDefs } from '../../types/error';
import { GraphQLError } from 'graphql';
import { ServerContext } from '../../types/serverTypes';
import { ActionCart } from '../../types/cart/userCart';

export default class CartProxy {
  private readonly cartService: CartService;

  constructor(cartservice: CartService) {
    this.cartService = cartservice;
  }

  public async getUserCart (context: ServerContext) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GraphQLError(ErrorDefs.UNAUTHORIZED);

      const cart = await this.cartService.getUserCart(userId);
      return cart;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async updateCart (context: ServerContext, action: ActionCart, productId: string) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GraphQLError(ErrorDefs.UNAUTHORIZED);
      if (!productId) throw new GraphQLError(ErrorDefs.INVALID_INPUT);
      const actions: ActionCart[] = ['add', 'remove', 'clear'];
      if (!actions.includes(action)) throw new GraphQLError(ErrorDefs.INVALID_INPUT);
      
      const response = await this.cartService.cartUpdate(userId, productId, action);
      pubSub.publish(CartEvents.CART_UPDATED, { cartUpdated: response });

      return response;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}