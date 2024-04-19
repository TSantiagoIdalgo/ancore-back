import CartCommandService from '../../services/cartService/cartCommandService';
import GRPCErrorHandler from '../../helpers/error';
import { UpdateCart } from '../../types/proto';
import * as grpc from '@grpc/grpc-js';
import { UserProductRequest } from '../../../proto/out/UserPackage/UserProductRequest';


export default class CartCommandController {
  private cartCommandService: CartCommandService;

  constructor(cartCommandService: CartCommandService) {
    this.cartCommandService = cartCommandService;
  }

  public async addProductToCart(call: UpdateCart) {
    try {
      call.on('data', async (request: UserProductRequest) => {
        const { action, productId, userId } = request;
        if (!productId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid product id');
        if (!userId) throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid user id');

        switch (action) {
        case 'add': {
          try {
            const newProduct = await this.cartCommandService.addProduct(userId, productId);
            call.write(newProduct);
            call.end();
            break;
          } catch (error) {
            call.emit('error', error);
            break;
          }
        }
        case 'remove': {
          try {
            const newProduct = await this.cartCommandService.removeProduct(userId, productId);
            call.write(newProduct);
            call.end();
            break;
          } catch (error) {
            call.emit('error', error);
            break;
          }
        }
        case 'clear': {
          try {
            const newProduct = await this.cartCommandService.deleteProduct(userId, productId);
            call.write(newProduct);
            call.end();
            break;
          } catch (error) {
            call.emit('error', error);
            break;
          }
        }
        default:
          throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Invalid action');
        }
      });

      call.on('end', () => {
        call.end();
      });
    } catch (error) {
      console.log(error);
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error');
    }
  }
}