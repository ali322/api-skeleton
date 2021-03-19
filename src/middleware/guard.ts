import { Context } from 'koa'
import * as Validator from 'validatorjs'

Validator.useLang('zh')
Validator.register(
  'positive_integer',
  (val): boolean => {
    const parsed = Number(val)
    return !isNaN(parsed) && parsed > 0
  },
  ':attribute不是正整数'
)

Validator.setMessages('zh', {
  accepted: ':attribute的值必须是可接受的.',
  alpha: ':attribute的值只能包含字母.',
  // eslint-disable-next-line @typescript-eslint/camelcase
  alpha_dash: ':attribute的值只能包含字母,连字符和下划线.',
  // eslint-disable-next-line @typescript-eslint/camelcase
  alpha_num: ':attribute的值只能包含字母和数字.',
  between: ':attribute的(大小,长度等)只能在:min和:max之间.',
  confirmed: ':attribute的值确认不一致.',
  email: ':attribute的值格式不正确.',
  date: ':attribute的值日期格式错误.',
  def: ':attribute属性值类型错误.',
  digits: ':attribute的值必须是:digits位小数.',
  // eslint-disable-next-line @typescript-eslint/camelcase
  digits_between: ':attribute的值必须是介于 :min 和 :max 位的数字。',
  different: ':attribute的值和:different的值必须不同.',
  in: ':attribute的值不在可选范围内',
  integer: ':attribute的值必须是一个整数.',
  hex: ':attribute的值必须是十六进制',
  min: {
    numeric: ':attribute的值长度不能小于:min.',
    string: ':attribute的值长度不能小于:min.'
  },
  max: {
    numeric: ':attribute的值长度不能大于:max.',
    string: ':attribute的值长度不能大于:max.'
  },
  // eslint-disable-next-line @typescript-eslint/camelcase
  not_in: ':attribute的值不在可选范围内.',
  numeric: ':attribute的值必须是一个数字.',
  present: ':attribute的值必须提供但是可为空.',
  required: ':attribute的值不能为空.',
  // eslint-disable-next-line @typescript-eslint/camelcase
  required_if: '当:other的值是:value时,:attribute的值不能为空.',
  same: ':attribute的值和:same的值必须一致.',
  size: {
    numeric: ':attribute的值长度必须等于:size.',
    string: ':attribute的值长度必须等于:size.'
  },
  string: ':attribute的值必须是一个字符串.',
  url: ':attribute的值格式不正确.',
  regex: ':attribute的值格式不正确.',
  attributes: {}
})

export default (rules: Record<string, Record<string, string>>): any => {
  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
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
