import { Response } from 'express';

export interface ServerContext {
    res: Response,
    decodedToken: string | null // "decodedToken" refers to the "userId" (the email field)
}