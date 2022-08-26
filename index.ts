import { Request, Response, NextFunction } from 'express'
import HttpStatus from 'http-status-codes'


const camelCase = (str: string) => str.toLowerCase().replace(/(\_\w)/g, c => c[1].toUpperCase())

type IOptions = {
  promptErrors: boolean | (() => boolean) 
}

type IResponserrorObject = { 
  code: number
  status: string
  message: string
  success: boolean
  errors: any
}

class Responserror {
  
  private static preFunctions: Array<Function> = []
  
  private static posFunctions: Array<Function> = []
  
  static pre = (fn: Function) => this.preFunctions.push(fn)
  
  static pos = (fn: Function) => this.posFunctions.push(fn)
  
  private options: IOptions
  
  private mapStatusByCode: { [code: number]: string } = {}
  
  private responserror: IResponserrorObject = {
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    success: false,
    errors: undefined
  }
  
  private setMapStatusByCode = () => {
    for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
      if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
        Object.assign(this.mapStatusByCode, { [httpCode]: httpStatus })
      }
    }
  }
  
  private setDefaultValuesForResponserror = () => {
    // @ts-ignore
    if(!['code','status','message'].some((prop) => this.responserror[prop])) {
      this.responserror.code = 500
      this.responserror.status = 'INTERNAL_SERVER_ERROR'
      this.responserror.message = 'Internal Server Error'
    }
    if(!this.responserror.success) this.responserror.success = false
    if(!this.responserror.errors) this.responserror.errors = undefined
  }
  
  public getMessageByCode = function(code: string | number) {
    try { 
      return HttpStatus.getStatusText(code)
    } catch(e) {
      return undefined
    }
  }
   
  public getStatusByCode = (code: number): string | undefined => this.mapStatusByCode[code]
  
  public getCodeByStatus = (status: string): number | undefined => {
    for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
      if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
        if(String(httpStatus).trim().toUpperCase() == String(status).trim().toUpperCase()) {
          return httpCode
        }
      }
    }
  }
  
  constructor(options: IOptions) {
    this.options = options
    this.setMapStatusByCode()
  }
  
  errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
    
    Responserror.preFunctions.forEach((fn) => fn.apply(null))
    
    if(error.status) {
      this.responserror.status = error.status
      const code = this.getCodeByStatus(error.status)
      if(code) this.responserror.code = code
    }
    
    if(error.code) {
      this.responserror.code = error.code
      const status = this.getStatusByCode(error.code)
      if(status) this.responserror.status = status
    }
    
    this.responserror.message = error.message ?? this.getMessageByCode(this.responserror.code)
    this.responserror.errors = error.errors ?? error.content

    const responserLikeStatus = camelCase(this.responserror.status)
    
    /* Behavior when responser is available */
    // @ts-ignore
    if(typeof response[`send_${responserLikeStatus}`] === 'function') {
      // @ts-ignore
      return response[`send_${responserLikeStatus}`](this.responserror.message)
    }
    
    this.setDefaultValuesForResponserror()
    
    if(this.options.promptErrors === true || (typeof this.options.promptErrors === 'function' && this.options.promptErrors())) {
      // To be implemented
    }
    
    Responserror.posFunctions.forEach((fn) => fn.apply(null))
    
    delete error.code
    delete error.status
    delete error.message
    delete error.success
    delete error.errors
      
    return response.status(this.responserror.code).json({ ...this.responserror, ...error })
  }
}

export default Responserror
