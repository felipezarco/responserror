import { Request, Response, NextFunction } from 'express';
declare const errorHandler: (error: any, request: Request, response: Response, next: NextFunction) => any;
export default errorHandler;
