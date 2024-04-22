import { userValidate, emailValidate } from '../../helpers/validates/userValidates';
import { GraphQLError } from 'graphql';
import { IUserProxy } from '../../types/user/userProxy';
import { ServerContext } from '../../types/serverTypes';
import { ErrorDefs } from '../../types/error';
import { authorize } from '../../helpers/decorators/authorize';
import { ILogin } from '../../types/user/userService';
import { IUser } from '../../types/user/user';
import UserService from '../../services/users/userService';
import GRPCErrorHandler from '../../helpers/error';

export default class UserProxy implements IUserProxy {
  private readonly userService: UserService;
  
  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      if (!users || !users.users || users.users.length === 0) {
        throw new GraphQLError(ErrorDefs.NOT_FOUND, {
          extensions: { code: 404 }
        });
      }

      return users.users;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @authorize()
  public async getUserById(userId: string, context: ServerContext) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);

      const userIds = context.decodedToken ? context.decodedToken : userId;
      const user = await this.userService.getUser(userIds);
      return user;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getUserLogin (user: ILogin, context: ServerContext) {
    try {
      let token: string | null = null;
      if (user.type === 'Simple' ) {
        token = await this.userService.getUserLogin(user.email, user.password);
      } else if (user.type === 'Auth0') {
        token = await this.userService.getUserNetworkLogin(user.email, user.password, user.image);
      } else throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);

      if (!token) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      context.res.cookie('XSRF-TOKEN', `Bearer ${token}`, { httpOnly: true });

      return token;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async verifyUser (token: string) {
    try {
      if (!token) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);

      return await this.userService.userVerify(token);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async createUser (user: IUser) {
    try {
      if (!user.email || !user.password || !user.userName) {
        throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      }
      const validateUser = userValidate.parse(user) as IUser;
      return await this.userService.createUser(validateUser);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @authorize()
  public async updateUser (userId: string, context: ServerContext, user: IUser) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      if (user.email) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_CREDENTIALS);

      const validateUserId = emailValidate.parse({ email: userId });
      const validateUser = userValidate.parse(user) as IUser;

      return await this.userService.updateUser(validateUserId.email, validateUser);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @authorize()
  public async deleteUser (userId: string, context: ServerContext) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);

      return await this.userService.deleteUser(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  @authorize()
  public async userBan (userId: string, context: ServerContext) {
    try {
      if (!context.decodedToken) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);

      return await this.userService.userBan(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}