import * as Koa from 'koa'
import * as bodyparser from 'koa-bodyparser'
import * as helmet from 'koa-helmet'
import * as cors from '@koa/cors'
import router from './router'
import { logger, error } from './middleware'
import { connectDB } from './model'

const app = new Koa()

app.use(helmet())
app.use(cors())
app.use(bodyparser())
app.use(logger())
app.use(error())

connectDB()

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Server running at port 3000')
})
