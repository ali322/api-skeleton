import { BaseContext } from "koa";

export default () => {
  return async (ctx: BaseContext, next: () => Promise<any>) => {
    try {
      await next()
    } catch(err) {
      ctx.status = 406
      ctx.body = err
    }
  }
}