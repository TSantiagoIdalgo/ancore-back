import { productClient } from '../../config/clients';
import { Paginated, ProductId, ProductInput } from './resolverTypes';
import ProductGetters from '../../services/products/productGetters';
import ProductSetters from '../../services/products/productSetters';
import ProductService from '../../services/products/productService';
import ProductProxy from '../../proxies/products/productProxy';
import { ServerContext } from '../user/userResolverTypes';

const productGetter = new ProductGetters(productClient);
const productSetter = new ProductSetters(productClient);
const productService = new ProductService(productGetter, productSetter);
const productProxy = new ProductProxy(productService);


const productResolver = {
  Query: {
    getAllProducts: async (_root: Paginated, args: Paginated) => 
      productProxy.getAllProducts(args.page, args.size, args.filter),
    getProductById: async (_root: ProductId, args: ProductId) =>
      productProxy.getProductById(args.productId),
    getTotalPages: async (_root: Paginated, args: Paginated) =>
      productProxy.getTotalPages(args.size, args.filter)
  },
  Mutation: {
    updateProduct: async (_root: ProductInput, args: ProductInput, context: ServerContext) =>
      productProxy.updateProduct(context, args.productId, args.product),
    deleteProduct: async (_root: ProductId, args: ProductId, context: ServerContext) =>
      productProxy.deleteProduct(context, args.productId)
  }
};

export default productResolver;