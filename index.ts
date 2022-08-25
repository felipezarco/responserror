import { Request, Response, NextFunction } from 'express'
import HttpStatus from 'http-status-codes'

const camelCase = (str: string) => str.toLowerCase().replace(/(\_\w)/g, c => c[1].toUpperCase())

const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
  
  /* default */
  const responseObject = {
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    success: false,
    errors: undefined
  }
  
  // if(error == {}) return response.send(responseObject.code).json(responseObject)
  
  const mapObjectMethods: { [code: number]: string } = {}

  for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
    if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
      Object.assign(mapObjectMethods, { [httpCode]: camelCase(httpStatus) })
    }
  }
  
  const automaticMethod: { code: number, status: string } | null = ((error) => {
    
    if(!error) return null
    
    /* Code was given */
    if(error.code && Object.keys(mapObjectMethods).includes(String(error.code))) {
      for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
        if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
          if(httpCode == error.code) {
            return { 
              code: httpCode, 
              status: httpStatus
            } 
          }
        }
      }
    } 
    
    /* Status was given */
    if(error.status) {
      for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
        if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
          if(String(httpStatus).trim().toUpperCase() == String(error.status).trim().toUpperCase()) {
            return { 
              code: httpCode, 
              status: httpStatus
            } 
          }
        }
      }
    }
    
    return null
  })(error)
  
  const getStatusText = function(code: string | number) {
    try {
      return HttpStatus.getStatusText(code)
    } catch(e) {
      return undefined
    }
  }
  
  const statusText: string | undefined | null = automaticMethod ? getStatusText(automaticMethod.code) : null

  /* inferred */
  if(automaticMethod) {
    responseObject.code = automaticMethod?.code,
    responseObject.status = automaticMethod?.status
  }
  
  if(statusText) responseObject.message = statusText
  
  // if(error?.code) responseObject.code = error.code
  // if(error?.status) responseObject.status = error.status
  // if(error?.message) responseObject.message = error.message
  // if(error?.errors) responseObject.errors = error.errors
  // if(error?.success) responseObject.success = error.success
  
  // @ts-ignore
  // if(automaticMethod?.status && typeof response[`send_${automaticMethod.status}`] === 'function') {
  //   // @ts-ignore
  //   return response[`send_${automaticMethod}`](
  //     error?.message ?? statusText, error?.errors ?? error?.content
  //   )
  // }
  
  return response.status(responseObject.code).json({ ...responseObject, ...error })
}
 
export default errorHandler
