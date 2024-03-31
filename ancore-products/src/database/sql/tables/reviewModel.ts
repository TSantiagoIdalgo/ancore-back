import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { IReviews } from '../../../types/reviews';

const reviewModel = sequelize.define<IReviews>('reviews', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default reviewModel;