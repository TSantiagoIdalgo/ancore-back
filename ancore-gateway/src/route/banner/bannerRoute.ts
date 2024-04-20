import express, { Router } from 'express';
import BannerMethods from './bannerMethods';

const bannerRoute = Router();
const bannerMethods = new BannerMethods();

bannerRoute.post('/', express.json(), bannerMethods.createBanner);

bannerRoute.delete('/:bannerId', bannerMethods.deleteBanner);

export default bannerRoute;