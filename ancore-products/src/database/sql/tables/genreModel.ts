import { IGenreModel } from '../../../types/genre';
import { DataTypes } from 'sequelize';
import sequelize from '../db';

const genreModel = sequelize.define<IGenreModel>('genre', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  genre: { type: DataTypes.STRING, unique: true, allowNull: false },
});

export default genreModel;