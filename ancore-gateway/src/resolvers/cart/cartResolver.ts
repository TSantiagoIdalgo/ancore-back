import { ActionCart, CartEvents } from '../../types/cart/userCart';
import { ServerContext } from '../user/userResolverTypes';
import { PubSub } from 'graphql-subscriptions';
import CartService from '../../services/cart/cartService';
import CartProxy from '../../proxies/cart/cartProxy';

const cartService = new CartService();
const cartProxy = new CartProxy(cartService);
export const pubSub = new PubSub();

interface UpdateCart {
    action: ActionCart;
    productId: string;
}

const cartResolver = {
  Query: {
    getUserCart: async (_root: unknown, _args: unknown, context: ServerContext) => 
      await cartProxy.getUserCart(context)
  },
  Mutation: {
    updateCart: async (_root: UpdateCart, args: UpdateCart, context: ServerContext) =>
      await cartProxy.updateCart(context, args.action, args.productId)
  },
  Subscription: {
    cartUpdated: {
      subscribe: () => pubSub.asyncIterator(CartEvents.CART_UPDATED)
    }
  }
};

export default cartResolver;