import GRPCErrorHandler from '../../helpers/error';
import GenreRepository from '../../models/genre/genreRepository';
import * as grpc from '@grpc/grpc-js';
import * as PT from '../../types/proto';

export default class GenreController {
  private genreRepository: GenreRepository;

  constructor() {
    this.genreRepository = new GenreRepository();
  }

  public async getAllGenres(_call: PT.TGetGenres, callback: PT.TGetGenresResponse) {
    try {
      const genres = await this.genreRepository.getGenres();
      callback(null, { genres });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getGenreById(call: PT.TGetGenre, callback: PT.TGetGenreResponse) {
    try {
      const { genre } = call.request;
      if (!genre) throw new GRPCErrorHandler(400, 'Genre is required');
      const genreFind = await this.genreRepository.getGenre(genre);
      callback(null, genreFind);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async createGenre(call: PT.TCreateGenre, callback: PT.TCreateGenreResponse) {
    try {
      const { genre } = call.request;

      if (!genre) throw new GRPCErrorHandler(400, 'Genre is required');

      const genreSintax = genre[0].toUpperCase() + genre.slice(1).toLowerCase();
      const genreCreate = await this.genreRepository.createGenre(genreSintax);

      callback(null, genreCreate);
    } catch (error) {
      console.error(error);
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async deleteGenre(call: PT.TDeleteGenre, callback: PT.TDeleteGenreResponse) {
    try {
      const { genre } = call.request;
      if (!genre) throw new GRPCErrorHandler(400, 'Genre is required');

      const genreDelete = await this.genreRepository.deleteGenre(genre);

      callback(null, genreDelete);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}