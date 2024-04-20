import genreModel from '../../database/sql/tables/genreModel';
import GRPCErrorHandler from '../../helpers/error';

export default class GenreRepository {
  async getGenres () {
    try {
      const genres = await genreModel.findAll();
      if (genres.length === 0) throw new GRPCErrorHandler(400, 'Genres not found');
      return genres;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async getGenre (genre: string) {
    try {
      if (!genre) throw new GRPCErrorHandler(400, 'Genre is required');
      const genreFind = genreModel.findOne({ where: { name: genre } });
      
      if (!genreFind) throw new GRPCErrorHandler(400, 'Genre not found');
      return genreFind;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async createGenre(genre: string) {
    try {
      const genreFind = await this.getGenre(genre);
      if (genreFind) throw new GRPCErrorHandler(400, 'Genre already exist');
      if (!genre) throw new GRPCErrorHandler(400, 'Genre is required');

      return await genreModel.create({ genre });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async deleteGenre(genre: string) {
    try {
      const genreExist = await this.getGenre(genre);
      if (!genreExist) throw new GRPCErrorHandler(400, 'Genre doesn`t exist');
      await genreModel.destroy({ where: { genre } });
      return genreExist;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}