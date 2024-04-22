import { productClient } from '../../config/clients';
import { Paginated, ProductId } from './resolverTypes';
import ProductGetters from '../../services/products/productGetters';
import ProductService from '../../services/products/productService';
import ProductProxy from '../../proxies/products/productProxy';

const productGetter = new ProductGetters(productClient);
const productService = new ProductService(productGetter);
const productProxy = new ProductProxy(productService);


const productResolver = {
  Query: {
    getAllProducts: async (_root: Paginated, args: Paginated) => 
      productProxy.getAllProducts(args.page, args.size, args.filter),
    getProductById: async (_root: ProductId, args: ProductId) =>
      productProxy.getProductById(args.productId),
    getTotalPages: async (_root: Paginated, args: Paginated) =>
      productProxy.getTotalPages(args.size, args.filter)
  }
};

export default productResolver;