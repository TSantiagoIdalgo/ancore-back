import ProductSchema from '../../database/nosql/schemas/productsSchema';
import { IProductModel, IProductFilter } from '../../types/products';

export default class ProductQueryRepository {
  
  getAll(): Promise<IProductModel[]> {
    return ProductSchema.find({ disabled: false }).lean().exec();
  }

  getFiltered(size: number, page: number, filter?: IProductFilter): Promise<IProductModel[]> {
    const query = this.getFilterQuery(filter);
    const skipAmount = (page - 1) * size;
    return ProductSchema.find(query).skip(skipAmount).limit(size).lean().exec();
    
  }

  async getPages(size: number, filter?: IProductFilter): Promise<number> {
    const query = this.getFilterQuery(filter);
    const total = await ProductSchema.countDocuments(query);
    return Math.ceil(total / size);
  }

  getById(id: string): Promise<IProductModel | null> {

    return ProductSchema.findOne({ id });
  }

  private getFilterQuery (filter?: IProductFilter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { ...filter };
    if (filter?.genre) query.genre = { $in: filter.genre };
    if (filter?.minPrice || filter?.maxPrice) {
      query.price = {};
      if (filter?.minPrice) query.price.$gte = filter.minPrice;
      if (filter?.maxPrice) query.price.$lte = filter.maxPrice;
    }
    if (filter?.discount) query.discount = { $gte: filter.discount };
    if (filter?.score) query.score = { $gte: filter.score };
    if (filter?.platform) query.platform = filter.platform;
    if (filter?.name) query.name = { $regex: filter.name, $options: 'i' };

    return query;
  }
}