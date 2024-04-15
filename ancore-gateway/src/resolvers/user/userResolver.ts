import { ServerContext, CreateUser, LoginInput, Token, Update, UserId } from './userResolverTypes';
import { userClient } from '../../config/clients';
import UserGetters from '../../services/users/userGetters';
import UserSetters from '../../services/users/useSetters';
import UserService from '../../services/users/userService';
import UserProxy from '../../proxies/user/userProxy';

const userGetters = new UserGetters(userClient);
const userSetters = new UserSetters(userClient);
const userService = new UserService(userGetters, userSetters);
const userProxy = new UserProxy(userService);

const userResolver = {
  Query: {
    getAllUsers: async () =>
      await userProxy.getAllUsers(),
    getUserById: async (_root: UserId, args: UserId, context: ServerContext) =>
      await userProxy.getUserById(args.userId, context),
    getUserLogin: async (_root: LoginInput, args: LoginInput, context: ServerContext) =>
      await userProxy.getUserLogin(args.loginInput, context)
  },
  Mutation: {
    verifyUser: async (_root: Token, args: Token) =>
      await userProxy.verifyUser(args.token),
    createUser: async (_root: CreateUser, args: CreateUser) =>
      await userProxy.createUser(args.user),
    updateUser: async (_root: Update, args: Update, context: ServerContext) =>
      await userProxy.updateUser(args.userId, context, args.user),
    deleteUser: async (_root: UserId, args: UserId, context: ServerContext) =>
      await userProxy.deleteUser(args.userId, context),
    userBan: async (_root: UserId, args: UserId, context: ServerContext) =>
      await userProxy.userBan(args.userId, context)
  }
};

export default userResolver;