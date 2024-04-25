import { IBannerModel } from '../../../types/banner';
import { DataTypes } from 'sequelize';
import sequelize from '../db';

const bannerModel = sequelize.define<IBannerModel>('banner', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  }
});

export default bannerModel;