import { Sequelize } from 'sequelize';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } from '../../config/config';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false,
});

export default sequelize;
