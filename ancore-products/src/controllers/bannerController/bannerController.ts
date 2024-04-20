import BannerCommandRepository from '../../models/banner/bannerCommandRepository';
import BannerQueryRepository from '../../models/banner/bannerQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import * as PT from '../../types/proto';

export default class BannerController {
  private readonly bannerCommandRepository: BannerCommandRepository;
  private readonly bannerQueryRepository: BannerQueryRepository;

  constructor() {
    this.bannerCommandRepository = new BannerCommandRepository();
    this.bannerQueryRepository = new BannerQueryRepository();
  }

  public async getAllBanner (_call: PT.TGetBanners, callback: PT.TGetBannersResponse) {
    try {
      const banners = await this.bannerQueryRepository.getAll();
      if (banners.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Banners not found');
      }

      callback(null, { bannerData: banners });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getBannerById (call: PT.TGetBanner, callback: PT.TGetBannerResponse) {
    try {
      const { bannerId } = call.request;
      if (!bannerId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid banner id');

      const banner = await this.bannerQueryRepository.getOne(bannerId);

      if (!banner) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Banner not found');

      callback(null, banner);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'));
    }
  }

  public async createBanner (call: PT.TCreateBanner, callback: PT.TCreateBannerResponse) {
    try {
      const { bannerData } = call.request;
      if (!bannerData) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid banner data');

      const banner = await this.bannerCommandRepository.create(bannerData);

      callback(null, banner);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'));
    }
  }

  public async updateBanner (call: PT.TUpdateBanner, callback: PT.TUpdateBannerResponse) {
    try {
      const { bannerId, banner } = call.request;
      if (!bannerId || !banner) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid banner data');
      }

      const bannerUpdated = await this.bannerCommandRepository.update(bannerId, banner);

      callback(null, bannerUpdated);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'));
    }
  }

  public async deleteBanner (call: PT.TDeleteBanner, callback: PT.TDeleteBannerResponse) {
    try {
      const { bannerId } = call.request;
      if (!bannerId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid banner id');

      const bannerDeleted = await this.bannerCommandRepository.delete(bannerId);

      callback(null, bannerDeleted);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'));
    }
  }
}