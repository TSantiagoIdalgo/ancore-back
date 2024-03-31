import { IProducts, IProductModel } from '../../types/products';
import ProductSchema from '../../database/nosql/schemas/productsSchema';

export default class ProductCommandRepository {
  public create (product: IProducts): Promise<IProductModel> {
    return ProductSchema.create(product);
  }

  public update (id: string, data: IProducts): Promise<IProductModel | null> {
    return ProductSchema.findByIdAndUpdate({ id }, data, { new: true });
  }

  public delete (id: string): Promise<IProductModel | null> {
    return ProductSchema.findOneAndUpdate({ id }, { disabled: true }, { new: true });
  }
}