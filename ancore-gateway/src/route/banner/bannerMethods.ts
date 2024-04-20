import { Request, Response } from 'express';
import { bannerClient } from '../../config/clients';
import { BannerServiceClient } from '../../../proto/out/ProductsPackage/BannerService';
import { ErrorDefs } from '../../types/error';
import { tokenVerify } from '../../helpers/token';
import { BannerData__Output } from '../../../proto/out/ProductsPackage/BannerData';
import { IBanner } from '../../types/general/banner';
import { UploadedFile } from 'express-fileupload';
import { unlinkSync } from 'fs';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET_KEY } from '../../config/api';
import { v2 as cloudinary } from 'cloudinary';
import GRPCErrorHandler from '../../helpers/error';

export default class BannerMethods {
  private readonly client: BannerServiceClient;

  constructor() {
    this.client = bannerClient;
  }

  public createBanner = async (req: Request, res: Response) => {
    try {
      if (!req.files) throw new Error(ErrorDefs.INVALID_INPUT);

      const userId = tokenVerify(req);
      if (!userId) throw new Error(ErrorDefs.UNAUTHORIZED);

      const { id } = req.params;
      const { mainImage, subImage } = req.files;

      if (Array.isArray(mainImage)) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(subImage)) throw new Error(ErrorDefs.INVALID_INPUT);
      if (!mainImage || !subImage) throw new Error(ErrorDefs.INVALID_INPUT);
      if (!id) throw new Error(ErrorDefs.INVALID_INPUT);

      const [uploadSubImage, uploadMainImage] = await Promise.all([
        this.uploadFile(subImage),
        this.uploadFile(mainImage)
      ]);

      const newBanner = {
        mainImage: uploadMainImage,
        subImage: uploadSubImage,
        productId: id,
      };

      const bannerCreate = await this.create(newBanner);

      res.status(201).json(bannerCreate);
    } catch (error) {
      if (error instanceof Error) res.status(400).send(error.message);
      else res.status(400).json(error);
    }
  };

  public deleteBanner = async (req: Request, res: Response) => {
    try {
      const userId = tokenVerify(req);
      if (!userId) throw new Error(ErrorDefs.UNAUTHORIZED);

      const { id } = req.params;
      if (!id) throw new Error(ErrorDefs.INVALID_INPUT);

      const bannerDelete = await this.delete(id);

      res.status(200).json(bannerDelete);
    } catch (error) {
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

  private async uploadFile (file: UploadedFile) {
    const { tempFilePath } = file;
    try {
      this.checkExtension(file);
      cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: CLOUD_KEY,
        api_secret: CLOUD_SECRET_KEY
      });

      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'uploads',
        resource_type: 'auto',
        use_filename: true
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