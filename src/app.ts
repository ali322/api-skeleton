import * as Koa from 'koa'
import * as bodyparser from 'koa-bodyparser'
import * as helmet from 'koa-helmet'
import * as cors from '@koa/cors'
import * as jwt from 'koa-jwt'
import router from './router'
import { logger, error, ws } from './middleware'
import { connectDB } from './model'
import * as dotenv from 'dotenv'

export default async (): Promise<Koa> => {
  const app = new Koa()

  dotenv.config()

  app.use(helmet())
  app.use(cors())
  app.use(logger())
  app.use(bodyparser())
  app.use(
    jwt({
      secret: process.env.JWT_SECRET
    }).unless({
      path: [/^\/api\/v1\/public/]
    })
  )
  app.use(ws())
  try {
    await connectDB()
  } catch (e) {
    console.log('connect to database failed', e)
  }
  app.use(router.routes())
  app.use(router.allowedMethods())
  return app
}
