import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { IUser } from '../../../types/user';

const UserModel = sequelize.define<IUser>('users', {
  id: { 
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
  },
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  ban: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export default UserModel;