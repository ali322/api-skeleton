export function Namespace(value = ''): Function {
  return (target: any) => {
    target.prototype.namespace = value
    return target
  }
}

export function Middleware(...middlewares: any[]): Function {
  return (target: any, key: string, descriptor: any) => {
    if (key === undefined) {
      target.prototype.middleware = middlewares || []
      return target
    }
    const value = descriptor.value
    value.middleware = middlewares || []
    return descriptor
  }
}

export function Route(method: string, path: string): Function {
  return (target: any, key: string, descriptor: any) => {
    target.actions = target.actions || []
    target.actions.push(key)
    const value = descriptor.value
    value.path = path
    value.method = method
    return descriptor
  }
}

export function Get(path: string): Function {
  return Route('get', path)
}

export function Post(path: string): Function {
  return Route('post', path)
}

export function Put(path: string): Function {
  return Route('put', path)
}

export function Delete(path: string): Function {
  return Route('delete', path)
}