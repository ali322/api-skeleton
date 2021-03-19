import * as Websocket from 'ws'
import { Context } from 'koa'

export default (options: Record<string, any> = {}): any => {
  const wss = new Websocket.Server(
    Object.assign({}, options, { noServer: true })
  )
  const clients = new Map()
  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
    ctx.sendWS = (
      msg: any,
      isValid: (key: any) => boolean = (): boolean => true
    ): void => {
      clients.forEach((ws: Websocket, key: any): void => {
        if (ws.readyState === Websocket.OPEN && isValid(key)) {
          ws.send(msg)
          ws.send(key)
        }
      })
    }
    ctx.bindWS = (key: any, ws: Websocket): void => {
      clients.set(key, ws)
    }
    ctx.unbindWS = (key: any): void => {
      clients.delete(key)
    }
    // ctx.clients = clients
    const upgradeHeader = (ctx.request.headers.upgrade || '')
      .split(',')
      .map((s: string): string => s.trim())
    if (~upgradeHeader.indexOf('websocket')) {
      ctx.ws = (): any =>
        new Promise((resolve: (value: any) => void): void => {
          wss.handleUpgrade(ctx.req, ctx.req.socket, Buffer.alloc(0), resolve)
          ctx.respond = false
        })
    }
    await next()
  }
}
