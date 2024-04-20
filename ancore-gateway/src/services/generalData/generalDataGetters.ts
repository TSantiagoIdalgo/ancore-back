import { BannerData__Output } from '../../../proto/out/ProductsPackage/BannerData';
import { Banners__Output } from '../../../proto/out/ProductsPackage/Banners';
import { Genre__Output } from '../../../proto/out/ProductsPackage/Genre';
import { Genres__Output } from '../../../proto/out/ProductsPackage/Genres';
import { bannerClient } from '../../config/clients';
import { genreClient } from '../../config/clients';
import GRPCErrorHandler from '../../helpers/error';

export default class GeneralDataGetters {
  private readonly bannerClient = bannerClient;
  private readonly genreClient = genreClient;

  constructor() {
    this.bannerClient = bannerClient;
    this.genreClient = genreClient;
  }

  public getBanners() {
    return new Promise<Banners__Output>((resolve, reject) => {
      this.bannerClient.getAllBanners({}, (err, res) => {
        if (err || !res) {
          if (!err?.code) {
            reject(err);
            return;
          }
          reject(new GRPCErrorHandler(err.code, err.message));
          return;
        } else {
          resolve(res);
        }
      });
    });
  }

  public getBenner (bannerId: string) {
    return new Promise<BannerData__Output>((resolve, reject) => {
      this.bannerClient.getBannerById({ bannerId }, (err, res) => {
        if (err || !res) {
          if (!err?.code) {
            reject(err);
            return;
          }
          reject(new GRPCErrorHandler(err.code, err.message));
          return;
        } else {
          resolve(res);
        }
      });
    });
  }

  public getGenres () {
    return new Promise<Genres__Output>((resolve, reject) => {
      this.genreClient.getAllGenres({}, (err, res) => {
        if (err || !res) {
          if (!err?.code) {
            reject(err);
            return;
          }
          reject(new GRPCErrorHandler(err.code, err.message));
          return;
        } else {
          resolve(res);
        }
      });
    });
  }

  public getGenre (genre: string) {
    return new Promise<Genre__Output>((resolve, reject) => {
      this.genreClient.getGenreById({ genre }, (err, res) => {
        if (err || !res) {
          if (!err?.code) {
            reject(err);
            return;
          }
          reject(new GRPCErrorHandler(err.code, err.message));
          return;
        } else {
          resolve(res);
        }
      });
    });
  }
}