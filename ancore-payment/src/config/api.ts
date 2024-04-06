import { config } from 'dotenv';
config();

export const API_SECRET = process.env.SECRET ?? '';
export const EMAIL_HOST = process.env.HOST ?? '';
export const EMAIL_PORT = process.env.PORT ?? '';
export const EMAIL_USER = process.env.EMAIL ?? '';
export const EMAIL_PASSWORD = process.env.PASSWORD ?? '';
export const DB_USER = process.env.DB_USER ?? '';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
export const DB_HOST = process.env.DB_HOST ?? '';
export const DB_NAME = process.env.DB_NAME ?? '';
export const STRIPE_SECRET = process.env.STRIPE_SECRET ?? '';