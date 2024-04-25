import ProductSetters from '../../services/products/productSetters';
import ProductGetters from '../../services/products/productGetters';
import UserGetters from '../../services/users/userGetters';
import { Request, Response } from 'express';
import { ErrorDefs } from '../../types/error';
import { unlinkSync, existsSync } from 'fs';
import { tokenVerify } from '../../helpers/token';
import { IProductModel, IProductContent } from '../../types/products/products';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET_KEY } from '../../config/api';
import { UploadedFile } from 'express-fileupload';
import { userClient } from '../../config/clients';
import { v2 as cloudinary } from 'cloudinary';
import { ZodError } from 'zod';


export default class CreateProduct {
  private readonly productSetter: ProductSetters;
  private readonly productGetter: ProductGetters;

  constructor(productSetters: ProductSetters, productGetter: ProductGetters) {
    this.productSetter = productSetters;
    this.productGetter = productGetter;
  }

  public createProduct = async (req: Request, res: Response) => {
    try {
      await this.authorize(req);
      if (!req.files) throw new Error(ErrorDefs.INVALID_INPUT);

      const product = req.body as IProductModel;
      const { images, trailer, mainImage, backgroundImage } = req.files;

      if (!product) throw new Error(ErrorDefs.INVALID_INPUT);
      if (!Array.isArray(images) || !images) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(trailer) || !trailer) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(mainImage) || !mainImage) throw new Error(ErrorDefs.INVALID_INPUT);
      if (Array.isArray(backgroundImage) || !backgroundImage) throw new Error(ErrorDefs.INVALID_INPUT);

      const newProduct = {
        name: product.name,
        price: Number(product.price),
        stock: Number(product.stock),
        disabled: false,
        platform: product.platform,
        score: 0.0,
        distributor: product.distributor,
        developer: product.developer,
        genre: product.genre,
        description: product.description,
        trailer: await this.uploadFile(trailer),
        mainImage: await this.uploadFile(mainImage),
        images: await Promise.all(images.map(image => this.uploadFile(image))),
        backgroundImage: await this.uploadFile(backgroundImage),
        amount: 0,
        discount: Number(product.discount)
      };

      const productCreate = await this.productSetter.create(newProduct);

      res.status(201).json(productCreate);
    } catch (error) {
      if (req.files) {
        const { mainImage, images, trailer, backgroundImage } = req.files;
        if (!Array.isArray(mainImage) && existsSync(mainImage.tempFilePath)) {
          unlinkSync(mainImage.tempFilePath);
        }
        if (!Array.isArray(trailer) && existsSync(trailer.tempFilePath)) {
          unlinkSync(trailer.tempFilePath);
        }
        if (Array.isArray(images)) {
          images.map(image => {
            if (existsSync(image.tempFilePath)) unlinkSync(image.tempFilePath);
          });
        }
        if (!Array.isArray(backgroundImage) && existsSync(backgroundImage.tempFilePath)) {
          unlinkSync(backgroundImage.tempFilePath);
        }
      }
      if (error instanceof Error) {
        res.status(400).json(error.message);
      } else res.status(500).json(ErrorDefs.INTERNAL_ERROR);
    }
  };

  public deleteProduct = async (req: Request, res: Response) => {
    try {
      await this.authorize(req);
      const { id } = req.params;
      if (!id) throw new Error(ErrorDefs.INVALID_INPUT);
      const product = await this.productGetter.getProduct(id);
      const { mainImage, trailer, images } = product;
      if (!mainImage || !trailer || !images) throw new Error(ErrorDefs.NOT_FOUND);

      await Promise.all([
        this.productSetter.delete(id),
        this.deleteFile(mainImage),
        this.deleteFile(trailer),
        images.map(image => this.deleteFile(image))
      ]);

      res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      } else res.status(500).json(ErrorDefs.INTERNAL_ERROR);
    }
  };

  public updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { mainImage, images, trailer } = req.files as IProductContent;
      if (!id) throw new Error(ErrorDefs.INVALID_INPUT);
      const productUpdate = req.body as IProductModel;
      const product = await this.productGetter.getProduct(id);
      if (!product) throw new Error(ErrorDefs.INVALID_INPUT); 

      if (mainImage && product.mainImage) {
        await this.deleteFile(product.mainImage);
        const uploadImage = await this.uploadFile(mainImage);
        productUpdate.mainImage = uploadImage;
      }

      if (images) {
        if (product.images && product.images.length > 5) throw new Error(ErrorDefs.INVALID_INPUT);
        if (product.images) {
          if ((images.length + product.images.length) > 5) {
            throw new Error(ErrorDefs.INVALID_INPUT);
          }
        }
        if (Array.isArray(images)) {
          const uploadImages = await Promise.all(images.map(image => this.uploadFile(image)));
          if (product.images && product.images.length >= 1) {
            productUpdate.images = [...product.images, ...uploadImages];
          } else productUpdate.images = uploadImages;
        } else {
          const uploadImages = await this.uploadFile(images);
          if (product.images && product.images.length >= 1) {
            productUpdate.images = [...product.images, uploadImages];
          } else productUpdate.images = [uploadImages];
        }
      }

      if (trailer && product.trailer) {
        await this.deleteFile(product.trailer);
        const uploadTrailer = await this.uploadFile(trailer);
        productUpdate.trailer = uploadTrailer;
      }

      const productUpdated = await this.productSetter.update(id, productUpdate);
      res.status(200).json(productUpdated);
    } catch (error) {
      if (req.files) {
        const { mainImage, images, trailer } = req.files;
        if (Array.isArray(mainImage)) {
          mainImage.map(image => { if (existsSync(image.tempFilePath)) unlinkSync(image.tempFilePath); });
        } else if (mainImage) unlinkSync(mainImage.tempFilePath);

        if (Array.isArray(trailer)) {
          trailer.map(trail => { if (existsSync(trail.tempFilePath)) unlinkSync(trail.tempFilePath); });
        } else if (trailer) unlinkSync(trailer.tempFilePath);

        if (Array.isArray(images)) {
          images.map(image => { if (existsSync(image.tempFilePath)) unlinkSync(image.tempFilePath); });
        } else if (images) unlinkSync(images.tempFilePath);
      }

      if (error instanceof ZodError) res.status(400).json({ error: error.message });
      else if (error instanceof Error) res.status(400).json({ error: error.message });
      else res.status(500).json(ErrorDefs.INTERNAL_ERROR);
    }
  };

  public deleteProductImage = async (req: Request, res: Response) => {
    try {
      const { fileUrl, productId } = req.query;
      if (!productId || typeof productId !== 'string') throw new Error(ErrorDefs.INVALID_INPUT);
      if (!fileUrl || typeof fileUrl !== 'string') throw new Error(ErrorDefs.INVALID_INPUT);
      const product = await this.productGetter.getProduct(productId);
      if (!product || !product.images) throw new Error(ErrorDefs.NOT_FOUND);
      if (!product.images.some(image => image === fileUrl)) throw new Error(ErrorDefs.NOT_FOUND);
      if (product.images.length === 1) throw new Error(ErrorDefs.INVALID_INPUT);

      const productWithoutImage = {
        images: product.images.filter(image => image !== fileUrl)
      } as IProductModel;

      await Promise.all([
        this.productSetter.update(productId, productWithoutImage),
        this.deleteFile(fileUrl)
      ]);

      res.status(200).json(productWithoutImage);
    } catch (error) {
      if (error instanceof Error) res.status(400).json(error.message);
      else res.status(500).json(ErrorDefs.INTERNAL_ERROR);
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
      if (existsSync(tempFilePath)) unlinkSync(tempFilePath);

      return result.secure_url;
    } catch (error) {
      if (existsSync(tempFilePath)) unlinkSync(tempFilePath);
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(ErrorDefs.INTERNAL_ERROR);
    }
  }

  private async deleteFile (publicId: string) {
    try {
      // eslint-disable-next-line no-useless-escape
      const id = publicId.match(/\/uploads\/([^\/]+)\./);
      if (id && id[1]) await cloudinary.uploader.destroy(`uploads/${id[1]}`);
      else throw new Error(ErrorDefs.NOT_FOUND);
      return;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(ErrorDefs.INTERNAL_ERROR);
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