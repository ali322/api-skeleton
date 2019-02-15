import * as Router from 'koa-router'
import { join } from 'path'
import controllers from './controller'

const router = new Router()

function applyRoutes(router: any, ...controllers: any[]): void {
  for (let i in controllers) {
    const controller = controllers[i]
    for (let k in controller.actions) {
      const action = controller[controller.actions[k]]
      let middlewares: any[] = []
      if (Array.isArray(controller.middleware)) {
        middlewares = middlewares.concat(controller.middleware)
      }
      if (Array.isArray(action.middleware)) {
        middlewares = middlewares.concat(action.middleware)
      }
      router[action.method](
        controller.namespace
          ? join(controller.namespace, action.path)
          : action.path,
        ...middlewares,
        action
      )
    }
  }
}

applyRoutes(router, ...controllers)

export default router
