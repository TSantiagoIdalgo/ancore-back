import { BannerData } from '../../types/banner';
import bannerModel from '../../database/sql/tables/bannerModel';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import ProductSchema from '../../database/nosql/schemas/productsSchema';

export default class BannerQueryRepository {
  async getAll(): Promise<BannerData[]> {
    const banners = await bannerModel.findAll();
    if (banners.length === 0) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Banners not found');
    const bannersData: BannerData[] = [];

    banners.forEach(async (banner) => {
      const product = await ProductSchema.findOne({ id: banner.productId });
      if (product) bannersData.push({ 
        ...banner.dataValues, 
        name: product.name,
        price: product.price,
        discount: product.discount,
      });
    });

    return bannersData;
  }

  async getOne(id: string): Promise<BannerData> {
    const banner = await bannerModel.findOne({ where: { id } });
    if (!banner) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Banner not found');
    
    const product = await ProductSchema.findOne({ id: banner.productId });
    if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    return {
      ...banner.dataValues,
      name: product.name,
      price: product.price,
      discount: product.discount,
    };
  }
}