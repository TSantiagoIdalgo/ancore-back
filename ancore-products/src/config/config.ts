import { config } from 'dotenv';
config();

export const DB_USER = process.env.DB_USER ?? '';
export const DB_NAME = process.env.DB_NAME ?? '';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
export const DB_HOST = process.env.DB_HOST ?? '';
export const MONGO_URI = process.env.MONGO_URI ?? '';
export const MONGO_NAME = process.env.MONGO_NAME ?? '';
export const API_SECRET = process.env.SECRET ?? '';