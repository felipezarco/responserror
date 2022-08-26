
import express, { Response, NextFunction } from 'express'
import responser from 'responser'

import request from 'supertest'
import Responserror from './index'

test('it throws default response', async () => {
  
  const app = express()
  
  const router = express.Router()
  
  const errorHandler = new Responserror({ promptErrors: true }).errorHandler
  
  router.post('/planets', (_, response: Response, next: NextFunction) => {
    try {
      throw {}
    } catch(err) {
      return next(err)
    }
  })
   
  /* @ts-ignore */
  app.use(router, errorHandler)
  
  const response = await request(app).post('/planets')
  
  expect(response.body).toEqual({
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    success: false
  })
})

test('it sends error response for given code', async () => {
  
  const app = express()
  
  const router = express.Router()
  
  const { errorHandler } = new Responserror({ promptErrors: true })
  
  router.post('/planets', (_, response: Response, next: NextFunction) => {
    try {
      throw {
        code: 403
      }
    } catch(err) {
      return next(err)
    }
  })
   
  /* @ts-ignore */
  app.use(router, errorHandler)
  
  const response = await request(app).post('/planets')
  
  expect(response.body).toEqual({
    code: 403,
    status: 'FORBIDDEN',
    message: 'Forbidden',
    success: false
  })
})

test('it sends error response for given status', async () => {
  
  const app = express()
  
  const router = express.Router()
  
  const { errorHandler } = new Responserror({ promptErrors: true })
  
  router.post('/planets', (_, response: Response, next: NextFunction) => {
    try {
      throw {
        status: 'SERVICE_UNAVAILABLE'
      }
    } catch(err) {
      return next(err)
    }
  })
   
  /* @ts-ignore */
  app.use(router, errorHandler)
  
  const response = await request(app).post('/planets')
  
  expect(response.body).toEqual({
    code: 503,
    status: 'SERVICE_UNAVAILABLE',
    message: 'Service Unavailable',
    success: false
  })
})


test('it sends error response for given code', async () => {
  
  const app = express()
  
  app.use(responser)
  
  const router = express.Router()
  
  const { errorHandler } = new Responserror({ promptErrors: true })
  
  router.post('/planets', (_, response: Response, next: NextFunction) => {
    try {
      throw {
        code: 504
      }
    } catch(err) {
      return next(err)
    }
  })
   
  /* @ts-ignore */
  app.use(router, errorHandler)
  
  const response = await request(app).post('/planets')
  
  expect(response.body).toEqual({
    code: 504,
    status: 'GATEWAY_TIMEOUT',
    message: 'Gateway Timeout',
    success: false
  })
})
