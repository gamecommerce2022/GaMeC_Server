import basicAuth from 'express-basic-auth'
import swagger from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import { Express, NextFunction, Request, Response } from 'express'

import env from '../configs/env'

export = (app: Express) => {
 const swaggerOptions = {
  swaggerDefinition: {
   openapi: '3.0.0',
   info: {
    title: env.app.name,
    description: env.app.description,
    version: env.app.version,
   },
   servers: [
    {
     url: `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
    },
   ],
  },
  apis: ['src/docs/*.yml', 'src/apis/routes/v1/*.js'],
 }

 if (env.isDevelopment) {
  app.use(
   env.swagger.route,
   env.swagger.username
    ? basicAuth({
     users: {
      [`${env.swagger.username}`]: env.swagger.password,
     },
     challenge: true,
    })
    : (req: Request, res: Response, next: NextFunction) => next(),
   swagger.serve,
   swagger.setup(swaggerJsDoc(swaggerOptions))
  )
 }
}