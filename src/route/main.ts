import { route, namespace } from '../lib/decorator'
import { Context } from 'koa'

@namespace()
class Main {
  @route('get', '/')
  public index(ctx: Context): void {
    ctx.body = 'hello world'
  }
  @route('get', '/public/message')
  async all(ctx: Context): Promise<void> {
    if (ctx.ws) {
      const ws = await ctx.ws()
      const { token } = ctx.query
      ctx.bindWS(token, ws)
      ws.send('connected')
      ws.on('close', (): void => {
        ctx.unbindWS(token)
      })
    }
  }
}

export default new Main()
