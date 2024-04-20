import { Genre__Output } from '../../../proto/out/ProductsPackage/Genre';
import { genreClient } from '../../config/clients';
import GRPCErrorHandler from '../../helpers/error';
import { IGenre } from '../../types/general/genre';

export default class GeneralDataSetters {
  private readonly genreClient = genreClient;

  constructor() {
    this.genreClient = genreClient;
  }

  public createGenre (genre: IGenre) {
    return new Promise<Genre__Output>((resolve, reject) => {
      this.genreClient.createGenre(genre, (err, res) => {
        if (err || !res) {
          if (!err?.code) {
            reject(err);
            return;
          }
          reject(new GRPCErrorHandler(err.code, err.message));
          return;
        } else {
          resolve(res);
        }
      });
    });
  }

  public deleteGenre (genre: string) {
    return new Promise<Genre__Output>((resolve, reject) => {
      this.genreClient.deleteGenre({ genre }, (err, res) => {
        if (err || !res) {
          if (!err?.code) {
            reject(err);
            return;
          }
          reject(new GRPCErrorHandler(err.code, err.message));
          return;
        } else {
          resolve(res);
        }
      });
    });
  }
}