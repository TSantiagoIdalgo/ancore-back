import UserGetters from '../../services/users/userGetters';
import GRPCErrorHandler from '../error';
import { userClient } from '../../config/clients';
import { ServerContext } from '../../types/serverTypes';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';
import { User__Output } from '../../../proto/out/UserPackage/User';

type UserId = string | undefined;

export function authorize() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (userId: UserId, context: ServerContext, ...args: any[]) {
      try {
        if (!userId || !context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);

        const getter = new UserGetters(userClient);
        const ownUser = await getter.getUser(context.decodedToken);
        const user = await getter.getUser(userId);

        if (!ownUser) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
        if (!user) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);
        
        if (!authorizeUser(user, ownUser)) throw new GRPCErrorHandler(403, ErrorDefs.FORBIDDEN);

        return await original.call(this, userId, context, ...args);
      } catch (error) {
        if (error instanceof GRPCErrorHandler) {
          throw new GraphQLError(error.message, { extensions: { code: error.code }});
        }
        throw error;
      }
    };
  };
}

function authorizeUser (user: User__Output, owner: User__Output) {
  if (owner.role === 'admin') return true;
  return user.role === 'user' && user.email === owner.email;
}