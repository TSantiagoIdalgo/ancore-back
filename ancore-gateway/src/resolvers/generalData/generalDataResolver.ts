import GeneralDataProxy from '../../proxies/generalData/generalDataProxy';
import { IGenre } from '../../types/general/genre';
import { ServerContext } from '../user/userResolverTypes';

const generalDataProxy = new GeneralDataProxy();

interface BannerId {
    bannerId: string
}

interface GenreId {
    genreId: string;
}

const generalDataResolver = {
  Query: {
    getAllBanners: async () =>
      await generalDataProxy.getAllBanners(),
    getBannerById: async (_root: BannerId, args: BannerId) =>
      await generalDataProxy.getBannerById(args.bannerId),
    getAllGenres: async () =>
      await generalDataProxy.getAllGenres(),
    getGenreById: async (_root: GenreId, args: GenreId) =>
      await generalDataProxy.getGenreById(args.genreId),
  },
  Mutation: {
    createGenre: async (_root: IGenre, args: IGenre, context: ServerContext) =>
      await generalDataProxy.createGenre(context, args),
    deleteGenre: async (_root: GenreId, args: GenreId, context: ServerContext) =>
      await generalDataProxy.deleteGenre(context, args.genreId)
  }
};

export default generalDataResolver;