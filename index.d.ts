import { Request, Response, NextFunction } from 'express';
declare const errorHandler: (error: any, request: Request, response: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandler;
