import UserGetters from '../../services/users/userGetters';
import GRPCErrorHandler from '../error';
import { userClient } from '../../config/clients';
import { ServerContext } from '../../types/serverTypes';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';

export function allowMethod() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (context: ServerContext, ...args: any[]) {
      try {
        if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);

        const getter = new UserGetters(userClient);
        const ownUser = await getter.getUser(context.decodedToken);

        if (!ownUser) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
        if (!ownUser.verify) throw new GRPCErrorHandler(403, ErrorDefs.UNAUTHENTICATED);
        if (ownUser.role !== 'admin') throw new GRPCErrorHandler(403, ErrorDefs.UNAUTHORIZED); 
        if (ownUser.ban) throw new GRPCErrorHandler(403, ErrorDefs.FORBIDDEN);

        return await original.call(this, context, ...args);
      } catch (error) {
        if (error instanceof GRPCErrorHandler) {
          throw new GraphQLError(error.message, { extensions: { code: error.code }});
        }
        throw error;
      }
    };
  };
}