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
        Object.assign(this.mapStatusByCode, { [httpCode]: camelCase(httpStatus) })
      }
    }
  }
  
  private setDefaultValuesForResponserror = () => {
    if(!this.responserror.code && !this.responserror.status && !this.responserror.message) {
      this.responserror.code = 500
      this.responserror.status = 'INTERNAL_SERVER_ERROR',
      this.responserror.message = 'Internal Server Error',
    }
    if(!this.responserror.success) this.responserror.success = false,
    if(!this.responserror.errors) this.responserror.errors = undefined
  }
  
  public getStatusTextByCode = function(code: string | number) {
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
    
    if(this.options.promptErrors === true || (typeof this.options.promptErrors === 'function' && this.options.promptErrors())) {
      
    }
    
    const statusText: string | undefined = this.getStatusTextByCode(this.responserror.code)
    
    this.responserror.message = error.message 
    
    // @ts-ignore
    if(automaticMethod?.status && typeof response[`send_${automaticMethod.status}`] === 'function') {
      // @ts-ignore
      return response[`send_${automaticMethod}`](
        error?.message ?? statusText, error?.errors ?? error?.content
      )
    }
    
    this.setDefaultValuesForResponserror()
     
    return response.status(this.responserror.code).json({ ...this.responserror, ...error })
  }
  
  
  
}

export default Responserror
