import ProductSchema from '../../database/nosql/schemas/productsSchema';
import { IProductModel } from '../../types/products';

export default class ProductQueryRepository {
  
  getAll(): Promise<IProductModel[]> {
    return ProductSchema.find({ disabled: false }).lean().exec();
  }

  getPaginate(size: number, page: number): Promise<IProductModel[]> {
    const skipAmount = (page - 1) * size;
    return ProductSchema.find().skip(skipAmount).limit(size).lean().exec();
  }

  async getPages(size: number): Promise<number> {
    const total = await ProductSchema.countDocuments();
    return Math.ceil(total / size);
  }

  getById(id: string): Promise<IProductModel | null> {

    return ProductSchema.findOne({ id });
  }
}