import { Request, Response, NextFunction } from 'express';
declare type IOptions = {
    promptErrors: boolean | (() => boolean);
};
declare class Responserror {
    private preFunctions;
    private posFunctions;
    pre: (fn: Function) => number;
    pos: (fn: Function) => number;
    private options;
    private mapStatusByCode;
    private responserror;
    private setMapStatusByCode;
    private setDefaultValuesForResponserror;
    getMessageByCode: (code: string | number) => string | undefined;
    getStatusByCode: (code: number) => string | undefined;
    getCodeByStatus: (status: string) => number | undefined;
    constructor(options?: IOptions);
    errorHandler: (error: any, request: Request, response: Response, next: NextFunction) => any;
}
export default Responserror;
