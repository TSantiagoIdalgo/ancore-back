import { config} from 'dotenv';
config();

export const USERS_PORT = process.env.USERS_PORT ?? '';
export const PRODUCTS_PORT = process.env.PRODUCTS_PORT ?? '';
export const PAYMENT_PORT = process.env.PAYMENT_PORT ?? '';
export const SECRET = process.env.SECRET ?? '';
export const CLOUD_NAME = process.env.CLOUD_NAME ?? '';
export const CLOUD_KEY = process.env.CLOUD_KEY ?? '';
export const CLOUD_SECRET_KEY = process.env.CLOUD_SECRET_KEY ?? '';