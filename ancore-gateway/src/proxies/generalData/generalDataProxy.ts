import GeneralDataService from '../../services/generalData/generalDataService';
import GRPCErrorHandler from '../../helpers/error';
import { ErrorDefs } from '../../types/error';
import { GraphQLError } from 'graphql';
import { IGenre } from '../../types/general/genre';
import { ServerContext } from '../../types/serverTypes';
import { allowMethod } from '../../helpers/decorators/allowMethod';

export default class GeneralDataProxy {
  private readonly generalDataService: GeneralDataService;

  constructor() {
    this.generalDataService = new GeneralDataService();
  }

  public async getAllBanners () {
    try {
      const banners = await this.generalDataService.getAllBanners();
      return banners;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getBannerById (bannerId: string) {
    try {
      if (!bannerId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.generalDataService.getBannerById(bannerId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getAllGenres () {
    try {
      return await this.generalDataService.getAllGenres();
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getGenreById (genreId: string) {
    try {
      if (!genreId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.generalDataService.getGenreById(genreId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @allowMethod()
  public async createGenre (context: ServerContext, genre: IGenre) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(400, ErrorDefs.UNAUTHENTICATED);
      if (!genre) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.generalDataService.createGenre(genre);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @allowMethod()
  public async deleteGenre (context: ServerContext, genreId: string) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      if (!genreId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.generalDataService.deleteGenre(genreId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}