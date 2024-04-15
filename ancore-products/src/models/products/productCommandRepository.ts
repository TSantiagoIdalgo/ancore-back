import { IProductModel } from '../../types/products';
import ProductSchema from '../../database/nosql/schemas/productsSchema';

export default class ProductCommandRepository {
  public create (product: IProductModel): Promise<IProductModel> {
    return ProductSchema.create({
      ...product,
      price: Number(product.price),
      discount: Number(product.discount)
    });
  }

  public update (id: string, data: IProductModel): Promise<IProductModel | null> {
    return ProductSchema.findByIdAndUpdate({ id }, data, { new: true });
  }

  public delete (id: string): Promise<IProductModel | null> {
    return ProductSchema.findOneAndUpdate({ id }, { disabled: true }, { new: true });
  }
}