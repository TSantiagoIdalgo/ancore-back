import express, { Router } from 'express';
import BannerMethods from './bannerMethods';

const bannerRoute = Router();
const bannerMethods = new BannerMethods();

bannerRoute.post('/:productId', express.json(), bannerMethods.createBanner);

bannerRoute.delete('/:id', bannerMethods.deleteBanner);

bannerRoute.put('/:id', express.json(), bannerMethods.updateBanner);

export default bannerRoute;