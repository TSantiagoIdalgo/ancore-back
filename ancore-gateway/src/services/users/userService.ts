import { userValidate, emailValidate } from '../../helpers/validates/userValidates';
import { ErrorDefs } from '../../types/error';
import { GraphQLError } from 'graphql';
import { IUser } from '../../types/user/user';
import UserGetters from './userGetters';
import UserSetters from './useSetters';
import GRPCErrorHandler from '../../helpers/error';

export default class UserService {
  private readonly userGetters: UserGetters;
  private readonly userSetters: UserSetters;

  constructor (userGetter: UserGetters, userSetter: UserSetters) {
    this.userGetters = userGetter;
    this.userSetters = userSetter;
  }

  public getAllUsers () {
    try {
      return this.userGetters.getUsers();
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getUser (userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      const user = await this.userGetters.getUser(userId);

      if (!user) throw new GRPCErrorHandler(404, 'USER_NOT_FOUND');
      return user;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getUserLogin (email: string, password: string) {
    try {
      if (!email || !password) throw new GRPCErrorHandler(400, ErrorDefs.MISING_DATA);
      const userData = userValidate.parse({ email, password });
      if (!userData.email || !userData.password) throw new GRPCErrorHandler(400, ErrorDefs.MISING_DATA);

      const user = await this.userGetters.getUserLogin(userData.email, userData.password);
      if (!user.token) throw new GRPCErrorHandler(400, 'UNAUTHORIZED');
      return user.token;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async getUserNetworkLogin (email: string, password: string, image?: string) {
    try {
      if (!email || !password  || !image) throw new GRPCErrorHandler(400, ErrorDefs.MISING_DATA);
      const userData = userValidate.parse({ email, password, image });
      if (!userData.email || !userData.password) throw new GRPCErrorHandler(400, ErrorDefs.MISING_DATA); 
      const user = await this
        .userGetters
        .getUserNetworkLogin(userData.email, userData.password, userData.image);
    
      if (!user.token) throw new GRPCErrorHandler(400, 'UNAUTHORIZED');
      return user.token;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async userVerify (token: string) {
    try {
      if (!token) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      return await this.userSetters.userVerify(token);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async createUser (user: IUser) {
    try {
      if (!user.email || !user.userName || !user.password) {
        throw new GRPCErrorHandler(400, ErrorDefs.MISING_DATA);
      }
      const validateUser = userValidate.parse(user);
      return await this.userSetters.createUser(validateUser);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async updateUser (userId: string, user: IUser) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      const validateUserId = emailValidate.parse({ email: userId });
      const validateUser = userValidate.parse(user);
      return await this.userSetters.updateUser(validateUserId.email, validateUser);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async deleteUser (userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.MISING_FIELD);
      const validateUserId = emailValidate.parse({ email: userId });
      return await this.userSetters.deleteUser(validateUserId.email);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  public async userBan (userId: string) {
    try {
      return await this.userSetters.userBan(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }
}