import jwt from 'jsonwebtoken';
import GRPCErrorHandler from './error';
import { SECRET } from '../config/api';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../types/error';

interface DecodedToken {
    email: string
}

export const tokenVerify = (req: Request) => {
  let token: string | null;
  if (req.cookies) token = req.cookies['XSRF-TOKEN'];
  else if (req.headers.authorization) token = req.headers.authorization;
  else return null;
  
  try {
    if (typeof token !== 'string') {
      throw new GRPCErrorHandler(400, ErrorDefs.UNAUTHENTICATED);
    }
    if (!token.toLowerCase().startsWith('bearer ')) {
      throw new GRPCErrorHandler(400, ErrorDefs.UNAUTHENTICATED);
    }

    const authorizationHeader = token.slice(7);
    const decoded = jwt.verify(authorizationHeader, SECRET) as DecodedToken;
    return decoded.email;
  } catch (error) {
    if (error instanceof GRPCErrorHandler) 
      throw new GraphQLError(error.message, { extensions: { code: error.code } });
    else throw new GraphQLError('INTERNAL_ERROR');
  }
};