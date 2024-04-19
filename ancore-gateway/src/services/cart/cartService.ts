import { GraphQLError } from 'graphql';
import { cartClient } from '../../config/clients';
import { ErrorDefs } from '../../types/error';
import { ActionCart } from '../../types/cart/userCart';
import GRPCErrorHandler from '../../helpers/error';
import CartSetter from '../../services/cart/cartSetter';
import CartGetter from '../../services/cart/cartGetter';

export default class CartService {
  private readonly cartGetter: CartGetter;
  private readonly cartSetter: CartSetter;

  constructor() {
    this.cartGetter = new CartGetter(cartClient);
    this.cartSetter = new CartSetter(cartClient);
  }

  public async cartUpdate (userId: string, productId: string, action: ActionCart) {
    try {
      const response = await this.cartSetter.update(action, userId, productId);

      return response;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getUserCart (userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);
      const cart = await this.cartGetter.getCart(userId);

      if (!cart.products) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);
      if (cart.products.length === 0) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return cart;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }
}