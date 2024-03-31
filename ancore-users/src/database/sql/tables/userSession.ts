import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { UserSession } from '../../../types/userSession';

const UserSessionModel = sequelize.define<UserSession>('user_session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  csrf: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, { timestamps: false });

export default UserSessionModel;