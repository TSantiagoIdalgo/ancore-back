import ProductSchema from '../../database/nosql/schemas/productsSchema';
import { IProductModel } from '../../types/products';

export default class ProductQueryRepository {
  
  getAll(): Promise<IProductModel[]> {
    return ProductSchema.find({ disabled: false }).lean().exec();
  }

  getById(id: string): Promise<IProductModel | null> {
    return ProductSchema.findById(id);
  }
}