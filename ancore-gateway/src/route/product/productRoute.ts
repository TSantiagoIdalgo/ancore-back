import { Router } from 'express';
import { productClient } from '../../config/clients';
import ProductSetters from '../../services/products/productSetters';
import CreateProduct from './createProduct';

const productRouter = Router();
const productSetters = new ProductSetters(productClient);
const createProduct = new CreateProduct(productSetters);

productRouter.post('/', createProduct.createProduct);

export default productRouter;