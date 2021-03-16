import * as Websocket from 'ws'
import { Context } from 'koa'

export default (options: Record<string, any> = {}) => {
    const wss = new Websocket.Server(Object.assign({}, options, { noServer: true }))
    const clients = new Map()
    return async (ctx: Context, next: () => Promise<any>) => {
        ctx.sendWS = (msg: any, isValid: (key: any) => boolean = () => true) => {
            // wss.clients.forEach((client: Websocket) => {
            //     if (client.readyState === Websocket.OPEN) {
            //         console.log(JSON.stringify(client.url))
            //         client.send(msg)
            //     }
            // })
            clients.forEach((ws: Websocket, key: any) => {
                if (ws.readyState === Websocket.OPEN && isValid(key)) {
                    ws.send(msg)
                    ws.send(key)
                }
            })
        }
        ctx.bindWS = (key: any, ws: Websocket) => {
            clients.set(key, ws)
        }
        ctx.unbindWS = (key: any) => {
            clients.delete(key)
        }
        // ctx.clients = clients
        const upgradeHeader = (ctx.request.headers.upgrade || '').split(',').map((s: string) => s.trim())
        if (~upgradeHeader.indexOf('websocket')) {
            ctx.ws = () => new Promise((resolve: (value: any) => void) => {
                wss.handleUpgrade(ctx.req, ctx.req.socket, Buffer.alloc(0), resolve)
                ctx.respond = false
            })
        }
        await next()
    }
}
