import { route, namespace } from '../lib/decorator'
import { BaseContext } from 'koa'

@namespace()
class Main {
  @route({ method: 'get', path: '/' })
  public index(ctx: BaseContext): void {
    ctx.body = 'hello world'
  }
}

export default new Main()
