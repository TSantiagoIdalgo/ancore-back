/* eslint-disable no-useless-escape */
import { Request, Response } from 'express';
import { bannerClient } from '../../config/clients';
import { BannerServiceClient } from '../../../proto/out/ProductsPackage/BannerService';
import { ErrorDefs } from '../../types/error';
import { tokenVerify } from '../../helpers/token';
import { BannerData__Output } from '../../../proto/out/ProductsPackage/BannerData';
import { IBanner } from '../../types/general/banner';
import { UploadedFile } from 'express-fileupload';
import { unlinkSync, existsSync } from 'fs';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET_KEY } from '../../config/api';
import { v2 as cloudinary } from 'cloudinary';
import GRPCErrorHandler from '../../helpers/error';
import GeneralDataGetters from '../../services/generalData/generalDataGetters';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_SECRET_KEY
});

export default class BannerMethods {
  private readonly client: BannerServiceClient;
  private readonly generalDataGettter: GeneralDataGetters;
  
  constructor() {
    this.client = bannerClient;
    this.generalDataGettter = new GeneralDataGetters();
  }

  public createBanner = async (req: Request, res: Response) => {
    const banner = await this.generalDataGettter.getBanners();
    try {
      if (!req.files) throw new Error(ErrorDefs.INVALID_INPUT);
      const userId = tokenVerify(req);
      if (!userId) throw new Error(ErrorDefs.UNAUTHORIZED);

      const { productId } = req.params;
      const { mainImage, subImage } = req.files;
      if (banner.bannerData?.some(banner => banner.productId === productId)) {
        throw new Error(ErrorDefs.ALREADY_EXISTS);
      }
      if (Array.isArray(mainImage) || !mainImage) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(subImage) || !subImage) throw new Error(ErrorDefs.INVALID_INPUT);
      if (!productId) throw new Error(ErrorDefs.INVALID_INPUT);

      const [uploadSubImage, uploadMainImage] = await Promise.all([
        this.uploadFile(subImage),
        this.uploadFile(mainImage)
      ]);

      const newBanner = {
        mainImage: uploadMainImage,
        subImage: uploadSubImage,
        productId
      };

      const bannerCreate = await this.create(newBanner);

      res.status(201).json(bannerCreate);
    } catch (error) {
      if (req.files) {
        const { subImage, mainImage } = req.files;
        if (!Array.isArray(subImage) && existsSync(subImage.tempFilePath)) {
          unlinkSync(subImage.tempFilePath);
        }
        if (!Array.isArray(mainImage) && existsSync(mainImage.tempFilePath)) {
          unlinkSync(mainImage.tempFilePath);
        }
      }
      if (error instanceof Error) res.status(400).send(error.message);
      else res.status(400).json(error);
    }
  };

  public deleteBanner = async (req: Request, res: Response) => {
    try {
      const userId = tokenVerify(req);
      if (!userId) throw new Error(ErrorDefs.UNAUTHORIZED);

      const { id } = req.params;

      const banner = await this.generalDataGettter.getBenner(id);
      if (!banner) throw new Error(ErrorDefs.NOT_FOUND);
      if (!banner.subImage || !banner.mainImage) throw new Error(ErrorDefs.BAD_REQUEST);
      const subImage = banner.subImage.match(/\/uploads\/([^\/]+)\./);
      const mainImage = banner.mainImage.match(/\/uploads\/([^\/]+)\./);
      if (!subImage || !mainImage) throw new Error(ErrorDefs.BAD_REQUEST);
      
      const bannerDelete = await this.delete(id);
      await cloudinary.uploader.destroy(`uploads/${subImage[1]}`);
      await cloudinary.uploader.destroy(`uploads/${mainImage[1]}`);

      res.status(200).json(bannerDelete);
    } catch (error) {
      if (error instanceof Error) res.status(400).send(error.message);
      else res.status(400).send(ErrorDefs.INTERNAL_ERROR);
    }
  };

  public updateBanner = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) throw new Error(ErrorDefs.INVALID_INPUT); 
      if (!req.files) throw new Error(ErrorDefs.INVALID_INPUT);
      const { mainImage, subImage } = req.files;
      if (Array.isArray(mainImage)) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(subImage)) throw new Error(ErrorDefs.INVALID_INPUT);

      const banner = await this.generalDataGettter.getBenner(id);

      const subImageId = banner.subImage?.match(/\/uploads\/([^\/]+)\./);
      const mainImageId = banner.mainImage?.match(/\/uploads\/([^\/]+)\./);
      
      if (subImageId && subImage) await cloudinary.uploader.destroy(`uploads/${subImageId[1]}`);
      if (mainImageId && mainImage) await cloudinary.uploader.destroy(`uploads/${mainImageId[1]}`);

      if (mainImage) {
        const uploadMainImage = await this.uploadFile(mainImage);
        await this.update(id, { mainImage: uploadMainImage, productId: banner.productId });
      }

      if (subImage) {
        const uploadSubImage = await this.uploadFile(subImage);
        await this.update(id, { subImage: uploadSubImage, productId: banner.productId });
      }

      const updatedBanner = await this.generalDataGettter.getBenner(id);
      res.status(200).json(updatedBanner);
    } catch (error) {
      if (req.files) {
        const { subImage, mainImage } = req.files;
        if (!Array.isArray(subImage) && existsSync(subImage.tempFilePath)) {
          unlinkSync(subImage.tempFilePath);
        }
        if (!Array.isArray(mainImage) && existsSync(mainImage.tempFilePath)) {
          unlinkSync(mainImage.tempFilePath);
        }
      }
      if (error instanceof Error) res.status(400).send(error.message);
      else res.status(400).send(ErrorDefs.INTERNAL_ERROR);
    }
  };

  private create (banner: IBanner) {
    return new Promise<BannerData__Output>((resolve, reject) => {
      this.client.createBanner(banner, (err, res) => {
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
    
  private delete (bannerId: string) {
    return new Promise<BannerData__Output>((resolve, reject) => {
      this.client.deleteBanner({ bannerId }, (err, res) => {
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

  private update (bannerId: string, banner: IBanner) {
    return new Promise<BannerData__Output>((resolve, reject) => {
      this.client.updateBanner({ bannerId, banner }, (err, res) => {
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

  private async uploadFile (file: UploadedFile) {
    const { tempFilePath } = file;
    try {
      this.checkExtension(file);

      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'uploads',
        resource_type: 'auto'
      });
      
      unlinkSync(tempFilePath);
      return result.secure_url;
    } catch (error) {
      if (error instanceof Error) {
        unlinkSync(tempFilePath);
        throw new Error(error.message);
      } else {
        unlinkSync(tempFilePath);
        throw new Error(ErrorDefs.INTERNAL_ERROR);
      }
    }
  }

  private checkExtension (file: UploadedFile) {
    const { name } = file;
    const extension = name.split('.').pop();
    if (!extension) throw new Error(ErrorDefs.INVALID_INPUT);
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'webm', 'mp4'];
    if (!allowedExtensions.includes(extension)) throw new Error(ErrorDefs.INVALID_INPUT);
  }
}