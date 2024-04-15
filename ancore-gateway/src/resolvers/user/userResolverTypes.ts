import { ServerContext } from '../../types/serverTypes';
import { ILogin } from '../../types/user/userService';
import { IUser } from '../../types/user/user';


interface UserId {
    userId: string
  }
  interface Token {
    token: string
  }
  
  interface Update {
    userId: string;
    user: IUser;
  }
  
  interface LoginInput {
    loginInput: ILogin;
  }
  
  interface CreateUser { 
    user: IUser
  }

export { UserId, Token, Update, LoginInput, CreateUser, ServerContext };