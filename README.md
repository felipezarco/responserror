# Responserror

> Express Error Handler to Node.js apps

Responserror is an [Error Handler middleware](https://expressjs.com/en/guide/error-handling.html) for express.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/responserror.svg)](https://badge.fury.io/js/felipezarco%2Fresponserror)  [![Coverage Status](https://coveralls.io/repos/github/felipezarco/responserror/badge.svg?branch=master)](https://coveralls.io/github/felipezarco/responserror?branch=master) ![Downloads](https://img.shields.io/npm/dw/responserror)

[![npm](https://nodei.co/npm/responserror.png)](https://www.npmjs.com/package/responserror)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/felipezarco/responserror/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/felipezarco/responserror/tree/main)

## Installation

The latest version is available at: https://www.npmjs.com/package/responserror

Use your favorite package manager to install. For instance: 

```
  yarn add responserror
```

Then import it and initialize a new instance:

```typescript
import Responserror from 'responserror'
const { errorHandler } = new Responserror()
```

**Then, you will want to add the `errorHandler` as your last express middleware**:

```javascript
app.use(authRouter, userRouter, errorHandler)
```

And you're good to go!

## Usage Example 

```typescript
import express from 'express'
import Responserror from 'responserror'

const app = express()
const router = express.Router()

const { errorHandler } = new Responserror()

router.post('/users', (_, response: Response, next: NextFunction) => {
  try {
    throw {
      code: 504,
    }
  } catch(err) {
    return next(err)
  }
})

app.use(router, errorHandler)

/* Outputs: */
{
  code: 504,
  status: 'GATEWAY_TIMEOUT',
  message: 'Gateway Timeout',
  success: false
}
```

- **code**: if given `responserror` will try to find its `status` and `message` automatically.

- **status**: if given `responserror` will try to find its `code` and `message` automatically.

- **success**: will always be `false`, unless explicitly specified.

- **message**: will be filled automatically if given `code` or `status` are valid and no `message` value is given.

- **errors**: anything can be sent here, responserror will not try to fill this.

Note: if `message` is given a value, that will **override** the automatic value responserror would give. This applies to all other properties. 

All properties are optional as shown in the first example.

### In this example, we send send `message` and `errors` properties:

````typescript
router.post('/users', (_, response: Response, next: NextFunction) => {
  try {
    throw {
      code: 400,
      message: 'Sorry!! Your request is invalid! =/',
      errors: [
        { name: 'clientFullName', message: 'The full name needs to contain more than one word!' }
      ]
    }
  } catch(err) {
    return next(err)
  }
})

/* Outputs: */
{
  code: 400,
  status: 'BAD_REQUEST',
  message:  'Sorry!! Your request is invalid! =/',
  errors: [
    { name: 'clientFullName', message: 'The full name needs to contain more than one word!' }
  ]
}
````
   
## Status & Codes

```javascript
100 // Continue
101 // Switching Protocols
102 // Processing
200 // OK
201 // Created
202 // Accepted
203 // Non Authoritative Information
204 // No Content
205 // Reset Content
206 // Partial Content
207 // Multi-Status
300 // Multiple Choices
301 // Moved Permanently
302 // Moved Temporarily
303 // See Other
304 // Not Modified
305 // Use Proxy
307 // Temporary Redirect
308 // Permanent Redirect
400 // Bad Request
401 // Unauthorized
402 // Payment Required
403 // Forbidden
404 // Not Found
405 // Method Not Allowed
406 // Not Acceptable
407 // Proxy Authentication Required
408 // Request Timeout
409 // Conflict
410 // Gone
411 // Length Required
412 // Precondition Failed
413 // Request Entity Too Large
414 // Request-URI Too Long
415 // Unsupported Media Type
416 // Requested Range Not Satisfiable
417 // Expectation Failed
418 // I'm a teapot
419 // Insufficient Space on Resource
420 // Method Failure
422 // Unprocessable Entity
423 // Locked
424 // Failed Dependency
428 // Precondition Required
429 // Too Many Requests
431 // Request Header Fields Too Large
451 // Unavailable For Legal Reasons
500 // Internal Server Error
501 // Not Implemented
502 // Bad Gateway
503 // Service Unavailable
504 // Gateway Timeout
505 // HTTP Version Not Supported
507 // Insufficient Storage
511 // Network Authentication Required
```
Check the [updated list of http status codes](https://github.com/prettymuchbryce/http-status-codes#codes) for all status and code accepted by `responserror`.

## Responser

If you want to have all HTTP responses at the tip of your finger (including sucessful ones), be sure to check out [responser](https://www.npmjs.com/package/responser) npm package. Differently from `responserror` which is the "catch-all" error handler for express, `responser` is used to directly send responses, wherever middleware/controller you are. Both can be used together.

![vscode suggestions](https://raw.githubusercontent.com/felipezarco/files/master/images/screenshots/responser.png "Responser typescript methods suggestion")

If you are using [responser](https://www.npmjs.com/package/responser) module in the same express instance, `responserror` will invoke send_* methods instead of its own.

## Testing

Run the test suit with `yarn test`.

## Contributing

If you want to contribute in any of theses ways:

- Give your ideas or feedback
- Question something
- Point out a problem or issue
- Enhance the code or its documentation
- Help in any other way

You can (and should) [open an issue](https://github.com/felipezarco/responserror/issues/new) or even a [pull request](https://github.com/felipezarco/responserror/compare)!

Thanks for your interest in contributing to this repo!

## Author

[Luiz Felipe Zarco](https://github.com/felipezarco) (felipezarco@hotmail.com)

## License

This code is licensed under the [MIT License](https://github.com/felipezarco/responserror/blob/master/LICENSE.md). See the [LICENSE.md](https://github.com/felipezarco/responserror/blob/master/LICENSE.md) file for more info.
