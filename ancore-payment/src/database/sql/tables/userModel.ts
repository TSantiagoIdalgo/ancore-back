import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { IUser } from '../../../types/user';

const UserModel = sequelize.define<IUser>('users', {
  id: { 
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  userName: {
    type: DataTypes.STRING(50),
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
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    allowNull: false,
    validate: {
      isIn: [['user', 'moderator','admin']]
    }
  },
  image: {
    type: DataTypes.STRING,
  }
});

export default UserModel;