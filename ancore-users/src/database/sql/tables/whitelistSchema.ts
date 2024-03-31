import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { IWhiteList } from '../../../types/whitelist';

const WhiteList = sequelize.define<IWhiteList>('whitelist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(128),
    allowNull: false
  }
});

export default WhiteList;