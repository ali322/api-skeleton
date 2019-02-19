import { route, namespace } from '../lib/decorator'
import { BaseContext } from 'koa'

@namespace()
class Main {
  @route('get', '/')
  public index(ctx: BaseContext): void {
    ctx.body = 'hello world'
  }
}

export default new Main()
