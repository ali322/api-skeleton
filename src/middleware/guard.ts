import { BaseContext } from 'koa'
import * as Validator from 'validatorjs'


export default (rules: Record<string, Record<string, string>>) => {
  return async (ctx: BaseContext, next: () => Promise<any>) => {
    for (const key in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, key)) {
        const data = key === 'body' ? ctx.request.body : ctx[key]
        let validation = new Validator(data, rules[key])
        if (validation.fails()) {
          // const errors = Object.values(validation.errors.all()).map(v => v[0]).join(',')
          const err = Object.values(validation.errors.all())[0][0]
          ctx.throw(err)
        }
      }
    }
    await next()
  }
}
