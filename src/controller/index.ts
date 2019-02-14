import {middleware, route, namespace} from '../lib/decorator'
import log from '../middleware/log'

@middleware(log)
@namespace()
class Index{
  @route({method: 'get', path: '/'})
  public index(ctx: any): void {
    ctx.body = 'hello world'
  }
}

export default new Index()