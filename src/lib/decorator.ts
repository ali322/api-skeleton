export function namespace(value = ''): Function {
  return (target: any) => {
    target.prototype.namespace = value
    return target
  }
}

export function middleware(...middlewares: any[]): Function {
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

export function route({method = 'get', path='/'}): Function {
  return (target: any, key: string, descriptor: any) => {
    target.actions = target.actions || []
    target.actions.push(key)
    const value = descriptor.value
    value.path = path
    value.method = method
    return descriptor
  }
}