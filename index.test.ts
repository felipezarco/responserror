
import express, { Response, NextFunction } from 'express'
import responser from 'responser'
import throwlhos from 'throwlhos'

import request from 'supertest'
import Responserror from './index'

test('it throws default response', async () => {
  
  const app = express()
  
  const router = express.Router()
  
  const errorHandler = new Responserror().errorHandler
  
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
  
  const { errorHandler } = new Responserror()
  
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
  
  const { errorHandler } = new Responserror()
  
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
  
  const { errorHandler } = new Responserror()
  
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

test('it executes pre and pos function', async () => {
  
  const app = express()
  
  app.use(responser)
  
  const router = express.Router()
  
  const responserror = new Responserror()
  
  const errorHandler = responserror.errorHandler
  
  responserror.pre(() => console.info('pre'))
  responserror.pos(() => console.info('pos'))
  
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

test('it sends error with invalid array', async () => {
  
  const app = express()
  
  app.use(responser)
  
  const router = express.Router()
  
  const { errorHandler } = new Responserror()
  
  router.post('/planets', (_, response: Response, next: NextFunction) => {
    try {
      throw {
        code: 400,
        errors: {
          invalid: [
            {
              field: "name",
              message: "Campo obrigatório!"
            },
            {
              field: "slug",
              message: "Campo obrigatório!"
            },
            {
              field: "description",
              message: "Campo obrigatório!"
            }
          ]
       }
      }
    } catch(err) {
      return next(err)
    }
  })
   
  /* @ts-ignore */
  app.use(router, errorHandler)
  
  const response = await request(app).post('/planets')
  
  expect(response.body).toEqual({
    code: 400,
    status: 'BAD_REQUEST',
    message: 'Bad Request',
    success: false,
    errors: {
      invalid: [
        {
          field: "name",
          message: "Campo obrigatório!"
        },
        {
          field: "slug",
          message: "Campo obrigatório!"
        },
        {
          field: "description",
          message: "Campo obrigatório!"
        }
      ]
    }
  })
})

test('it sends error with invalid array and throwlhos package', async () => {
  
  const app = express()

  const router = express.Router()
  const { errorHandler } = new Responserror()
  app.use(responser, router, errorHandler)
  
  const invalid = [
    {
      field: "name",
      message: "Campo obrigatório!"
    },
    {
      field: "slug",
      message: "Campo obrigatório!"
    },
    {
      field: "description",
      message: "Campo obrigatório!"
    }
  ]
  
  router.post('/planets', (_, response: Response, next: NextFunction) => {
    try {
      throw throwlhos.err_badRequest('Campos inválidos', { invalid })
    } catch(err) {
      return next(err)
    }
  })
  
  const response = await request(app).post('/planets')
  
  expect(response.body).toEqual({
    code: 400,
    status: 'BAD_REQUEST',
    message: 'Campos inválidos',
    success: false,
    errors: {
      invalid: [
        {
          field: "name",
          message: "Campo obrigatório!"
        },
        {
          field: "slug",
          message: "Campo obrigatório!"
        },
        {
          field: "description",
          message: "Campo obrigatório!"
        }
      ]
    }
  })
})
