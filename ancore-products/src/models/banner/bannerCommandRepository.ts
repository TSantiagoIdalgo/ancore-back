import { IBanner } from '../../types/banner';
import { BannerData } from '../../types/banner';
import ProductSchema from '../../database/nosql/schemas/productsSchema';
import bannerModel from '../../database/sql/tables/bannerModel';
import GRPCErrorHandler from '../../helpers/error';

export default class BannerCommandRepository {
  async create(banner: IBanner): Promise<BannerData> {
    const product = await ProductSchema.findOne({ id: banner.productId });
    if (!product) throw new GRPCErrorHandler(404, 'Product not found');

    const newBanner = await bannerModel.create({ ...banner });

    return {
      ...newBanner.dataValues,
      name: product.name,
      price: product.price,
      discount: product.discount,
    };
  }

  async update(id: string, banner: IBanner): Promise<BannerData> {
    const bannerFound = await bannerModel.findByPk(id);
    const product = await ProductSchema.findOne({ id: banner.productId });
    if (!product) throw new GRPCErrorHandler(404, 'Product not found');
    if (!bannerFound) throw new GRPCErrorHandler(404, 'Banner not found');

    bannerFound.set(banner);
    await bannerFound.save();

    return {
      ...bannerFound.dataValues,
      name: product.name,
      price: product.price,
      discount: product.discount,
    };
  }

  async delete(id: string): Promise<BannerData> {
    const banner = await bannerModel.findByPk(id);
    if (!banner) throw new GRPCErrorHandler(404, 'Banner not found');

    const product = await ProductSchema.findOne({ id: banner.productId });
    if (!product) throw new GRPCErrorHandler(404, 'Product not found');
    await bannerModel.destroy({ where: { id } });

    return {
      ...banner.dataValues,
      name: product.name,
      price: product.price,
      discount: product.discount,
    };
  }
}