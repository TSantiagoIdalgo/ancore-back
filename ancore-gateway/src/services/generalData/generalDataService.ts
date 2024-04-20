import GeneralDataGetters from './generalDataGetters';
import GeneralDataSetters from './generalDataSetters';
import GRPCErrorHandler from '../../helpers/error';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';
import { IGenre } from '../../types/general/genre';


export default class GeneralDataService {
  private readonly generalDataGetters: GeneralDataGetters;
  private readonly generalDataSetters: GeneralDataSetters;

  constructor () {
    this.generalDataGetters = new GeneralDataGetters();
    this.generalDataSetters = new GeneralDataSetters();
  }

  public async getAllBanners () {
    try {
      const banners = await this.generalDataGetters.getBanners();
      if (!banners.bannerData) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);
      if (banners.bannerData?.length === 0) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return banners.bannerData;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getBannerById (bannerId: string) {
    try {
      const banner = await this.generalDataGetters.getBenner(bannerId);
      if (!banner) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return banner;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getAllGenres () {
    try {
      const genres = await this.generalDataGetters.getGenres();
      if (!genres.genres) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);
      if (genres.genres.length === 0) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return genres.genres;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getGenreById (genreId: string) {
    try {
      const genre = await this.generalDataGetters.getGenre(genreId);
      if (!genre) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return genre;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async createGenre (genre: IGenre) {
    try {
      const newGenre = await this.generalDataSetters.createGenre(genre);
      if (!newGenre) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return newGenre;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async deleteGenre (genreId: string) {
    try {
      const genre = await this.generalDataSetters.deleteGenre(genreId);
      if (!genre) throw new GRPCErrorHandler(400, ErrorDefs.NOT_FOUND);

      return genre;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }
}