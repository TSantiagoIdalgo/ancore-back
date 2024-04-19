import userResolver from './user/userResolver';
import productResolver from './product/productResolver';
import reviewResolver from './review/reviewResolver';
import cartResolver from './cart/cartResolver';
import whitelistResolver from './whitelist/whitelistResolver';

export const rootResolver = [
  userResolver, productResolver, reviewResolver, 
  cartResolver, whitelistResolver
];