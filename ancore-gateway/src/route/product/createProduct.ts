import ProductSetters from '../../services/products/productSetters';
import UserGetters from '../../services/users/userGetters';
import productValidate from '../../helpers/validates/productValidate';
import { Request, Response } from 'express';
import { ErrorDefs } from '../../types/error';
import { unlinkSync } from 'fs';
import { tokenVerify } from '../../helpers/token';
import { IProductModel } from '../../types/products/products';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET_KEY } from '../../config/api';
import { UploadedFile } from 'express-fileupload';
import { userClient } from '../../config/clients';
import { v2 as cloudinary } from 'cloudinary';


export default class CreateProduct {
  private readonly productSetter: ProductSetters;

  constructor(productSetters: ProductSetters) {
    this.productSetter = productSetters;
  }

  public createProduct = async (req: Request, res: Response) => {
    try {
      this.authorize(req);
      if (!req.files) throw new Error(ErrorDefs.INVALID_INPUT);

      const product = req.body as IProductModel;
      const { images, trailer, mainImage } = req.files;

      if (!product) throw new Error(ErrorDefs.INVALID_INPUT);
      if (!Array.isArray(images) || !images) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(trailer) || !trailer) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(mainImage) || !mainImage) throw new Error(ErrorDefs.INVALID_INPUT);
      productValidate.safeParse(product);

      const [uploadTrailer, uploadImage, ...uploadImages] = await Promise.all([
        this.uploadFile(trailer),
        this.uploadFile(mainImage),
        ...images.map(image => this.uploadFile(image))
      ]);
      
      const newProduct = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        disabled: false,
        platform: product.platform,
        score: 0.0,
        distributor: product.distributor,
        developer: product.developer,
        genre: product.genre,
        description: product.description,
        trailer: uploadTrailer,
        mainImage: uploadImage,
        images: uploadImages,
        amount: 0,
        discount: product.discount
      };

      const productCreate = await this.productSetter.create(newProduct);

      res.status(201).json(productCreate);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      } else res.status(500).json(ErrorDefs.INTERNAL_ERROR);
    }
  };

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

  private async authorize (req: Request) {
    try {
      const userId = tokenVerify(req);
      if (userId === null) throw new Error(ErrorDefs.UNAUTHORIZED);
      const user = await new UserGetters(userClient).getUser(userId);
      if (!user) throw new Error(ErrorDefs.UNAUTHORIZED);
      if (user.role !== 'admin') throw new Error(ErrorDefs.UNAUTHORIZED);
      return user;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(ErrorDefs.INTERNAL_ERROR);
    }
  }
}