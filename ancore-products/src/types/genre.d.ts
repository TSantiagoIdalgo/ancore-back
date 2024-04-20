import { Model } from 'sequelize';

export interface IGenreModel extends Model {
    id: number;
    genre: string;
}