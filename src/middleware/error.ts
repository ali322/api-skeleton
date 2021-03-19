import { BaseContext } from 'koa'

export default (): any => {
  return async (ctx: BaseContext, next: () => Promise<any>): Promise<void> => {
    try {
      await next()
    } catch (err) {
      ctx.status = 200
      ctx.body = { code: -1, msg: err }
    }
  }
}
