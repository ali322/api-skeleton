import * as Router from 'koa-router'
import { join } from 'path'
import routes from './route'

const router = new Router()

function applyRoutes(router: any, ...routes: any[]): void {
  for (let i in routes) {
    const route = routes[i]
    for (let k in route.actions) {
      const action = route[route.actions[k]]
      let middlewares: any[] = []
      if (Array.isArray(route.middleware)) {
        middlewares = middlewares.concat(route.middleware)
      }
      if (Array.isArray(action.middleware)) {
        middlewares = middlewares.concat(action.middleware)
      }
      router[action.method](
        route.namespace
          ? join(route.namespace, action.path)
          : action.path,
        ...middlewares,
        action
      )
    }
  }
}

applyRoutes(router, ...routes)

export default router
