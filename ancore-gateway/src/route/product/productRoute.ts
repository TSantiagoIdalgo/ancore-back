import { Router } from 'express';
import { productClient } from '../../config/clients';
import ProductSetters from '../../services/products/productSetters';
import CreateProduct from './createProduct';
import ProductGetters from '../../services/products/productGetters';

const productRouter = Router();
const productGetter = new ProductGetters(productClient);
const productSetters = new ProductSetters(productClient);
const createProduct = new CreateProduct(productSetters, productGetter);

productRouter.post('/', createProduct.createProduct);

productRouter.put('/:id', createProduct.updateProduct);

productRouter.delete('/:id', createProduct.deleteProduct);

productRouter.delete('/', createProduct.deleteProductImage);

export default productRouter;