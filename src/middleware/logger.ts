import { BaseContext } from 'koa'
import * as winston from 'winston'
import { join } from 'path'

export default (): any => {
   winston.configure({
    level: 'debug',
    transports: [
      new winston.transports.File({
        filename: join('log', 'error.log'),
        level: 'error'
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  })
  return async (ctx: BaseContext, next: () => Promise<any>): Promise<void> => {
    const start: number = new Date().getMilliseconds()
    try {
      await next()
    catch(err) {
      ctx.status = 200
      console.log('err', err)
      ctx.body = { code: -1, msg: err.message }
    }
    const diff: number = new Date().getMilliseconds() - start
    let logLevel: string
    if (ctx.status >= 500) {
      logLevel = 'error'
    } else if (ctx.status >= 400 && ctx.status < 500) {
      logLevel = 'warn'
    } else {
      logLevel = 'info'
    }
    const msg = `${ctx.method} ${ctx.url} ${ctx.status} ${diff}ms`
    winston.log(logLevel, msg)
  }
}
