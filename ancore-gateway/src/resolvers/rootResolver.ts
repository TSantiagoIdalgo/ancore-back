import userResolver from './user/userResolver';
import productResolver from './product/productResolver';

export const rootResolver = [userResolver, productResolver];