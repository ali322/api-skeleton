import { Context } from 'koa'
import { Repository, getManager } from 'typeorm'
import { ValidationError, validate } from 'class-validator';
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import { namespace, route, middleware } from '../lib/decorator'
import { guard } from '../middleware'
import { User } from '../model'
import { formatedValidationError } from '../lib/formater';

@namespace('/api/v1')
class UserRoute {
  @route('get', '/public/user')
  @middleware(guard({
    query: {
      key: 'string', userID: 'string',
      page: 'positive_integer', limit: 'positive_integer', sortBy: 'in:DESC,ASC'
    }
  }))
  async all(ctx: Context): Promise<void> {
    const { key, userID, page = 1, limit = 10, sort = 'username', sortBy = 'DESC' } = ctx.query
    const repo: Repository<User> = getManager().getRepository(User)
    let qb = repo.createQueryBuilder("user")
      .orderBy(`user.${sort}`, sortBy)
    if (key) {
      qb = qb.andWhere("user.username LIKE :key", { key: `%${key}%` })
    }
    if (userID) {
      qb = qb.andWhere("user.id = :userID", { userID })
    }
    const count = await qb.getCount()
    qb = qb.skip((page - 1) * limit).take(limit)
    const rows: User[] = await qb.getMany()
    ctx.body = { code: 0, data: { count, rows } }
  }
  @route('post', '/public/user')
  @route('post', '/user')
  @middleware(guard({
    body: {
      username: 'required|between:5,10', email: 'required|email'
    }
  }))
  async create(ctx: Context): Promise<void> {
    const repo: Repository<User> = getManager().getRepository(User)
    const { avatar, id, username, email } = ctx.request.body
    const created: User = new User()
    created.avatar = avatar
    created.id = id
    created.username = username
    created.email = email
    const errs: ValidationError[] = await validate(created)
    if (errs.length > 0) {
      ctx.body = { code: -1, msg: formatedValidationError(errs) }
    } else {
      const saved = await repo.save(created)
      ctx.status = 201
      ctx.body = { code: 0, data: saved }
    }
  }
  @route('post', '/public/register')
  @middleware(guard({
    body: {
      username: 'required|between:3,10',
      password: 'required|between:3,10',
      repeat: 'required|between:3,10',
      email: 'required|email'
    }
  }))
  async register(ctx: Context): Promise<void> {
    const repo: Repository<User> = getManager().getRepository(User)
    const { username, password, repeat, email } = ctx.request.body
    if (password !== repeat) {
      ctx.body = {code: -1, msg:'password not matched'}
    } else {
      const exists = await repo.findOne({ username })
      if (exists) {
        ctx.body = {code: -1, msg:'username exists'}
      } else {
        const created: User = new User()
        const id = uuidv4()
        const cryptedPassword = await bcrypt.hash(password, 10)
        created.id = id
        created.username = username
        created.password = cryptedPassword
        created.email = email
        created.lastLoginedAt = new Date()
        const errs: ValidationError[] = await validate(created)
        if (errs.length > 0) {
          ctx.body = { code: -1, msg: formatedValidationError(errs) }
        } else {
          const saved = await repo.save(created)
          ctx.status = 201
          ctx.body = {
            code: 0,
            data: {
              token: jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '30 days' }),
              user: saved
            }
          }
        }
      }
    }
  }
  @route('post', '/public/login')
  @middleware(guard({
    body: {
      username: 'required|between:3,10',
      password: 'required|between:3,10',
    }
  }))
  async login(ctx: Context): Promise<void> {
    const repo: Repository<User> = getManager().getRepository(User)
    const { username, password } = ctx.request.body
    const exists = await repo.findOne({ username })
    if (exists) {
      const isPasswordMatch = await bcrypt.compare(password, exists.password)
      if (!isPasswordMatch) {
        ctx.body = {code: -1, msg:'password incorrect'}
      } else {
        ctx.status = 200
        ctx.body = {
          code: 0,
          data: {
            token: jwt.sign({ username, email:exists.email }, process.env.JWT_SECRET, { expiresIn: '30 days' }),
            user: exists
          }
        }
      }
    } else {
      ctx.body = {code: -1, msg:'username not exists'}
    }
  }
  @route('post', '/public/connect')
  @middleware(guard({
    body: {
      id: 'required|string',
      username: 'required|between:3,10',
      email: 'required|email'
    }
  }))
  async connect(ctx: Context): Promise<void> {
    const repo: Repository<User> = getManager().getRepository(User)
    const { id, username, email } = ctx.request.body
    const exists = await repo.findOne(id)
    if (exists) {
      exists.lastLoginedAt = new Date()
      const saved = await repo.save(exists)
      ctx.status = 200
      ctx.body = {
        code: 0,
        data: {
          token: jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '30 days' }),
          user: saved
        }
      }
    } else {
      const created: User = new User()
      created.id = id
      created.username = username
      created.email = email
      created.lastLoginedAt = new Date()
      const errs: ValidationError[] = await validate(created)
      if (errs.length > 0) {
        ctx.body = { code: -1, msg: formatedValidationError(errs) }
      } else {
        const saved = await repo.save(created)
        ctx.status = 201
        ctx.body = {
          code: 0,
          data: {
            token: jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '30 days' }),
            user: saved
          }
        }
      }
    }
  }
  @route('post', '/change/user/:id/password')
  @middleware(guard({
    body: {
      old: 'required|between:3,10',
      newed: 'required|between:3,10',
      repeat: 'required|between:3,10|same:newed'
    }
  }))
  async changePassword(ctx: Context): Promise<void> {
    const id = ctx.params.id
    const { old, newed, repeat } = ctx.request.body
    const repo: Repository<User> = getManager().getRepository(User)
    const updated = await repo.findOne(id)
    const isPasswordMatch = await bcrypt.compare(old, updated.password)
    if (!isPasswordMatch) {
      ctx.body = { code: -1, msg: '旧密码不正确' }
    } else if (newed !== repeat) {
      ctx.body = { code: -1, msg: '密码前后不一致' }
    } else {
      const cryptedPassword = await bcrypt.hash(newed, 10)
      updated.password = cryptedPassword
      const saved = await repo.save(updated)
      ctx.status = 200
      ctx.body = { code: 0, data: saved }
    }
  }
  @route('put', '/user/:id')
  @middleware(guard({
    params: { id: 'required|string' },
    body: {
      avatar: 'string',
      email: 'required|email'
    }
  }))
  async update(ctx: Context): Promise<void> {
    const id = ctx.params.id
    const { avatar, email } = ctx.request.body
    const repo: Repository<User> = getManager().getRepository(User)
    const updated = await repo.findOne(id)
    updated.avatar = avatar
    updated.email = email
    const errs: ValidationError[] = await validate(updated)
    if (errs.length > 0) {
      ctx.body = { code: -1, msg: formatedValidationError(errs) }
    } else {
      const saved = await repo.save(updated)
      ctx.status = 201
      ctx.body = { code: 0, data: saved }
    }
  }
  @route('get', '/user/:id')
  @middleware(guard({
    params: { id: 'required|string' }
  }))
  async one(ctx: Context): Promise<void> {
    const id = ctx.params.id
    const repo: Repository<User> = getManager().getRepository(User)
    const ret = await repo.findOne(id)
    ctx.body = { code: 0, data: ret }
  }

  @route('delete', '/user/:id')
  @middleware(guard({
    params: { id: 'required|string' }
  }))
  async delete(ctx: Context): Promise<void> {
    const id = ctx.params.id
    const repo: Repository<User> = getManager().getRepository(User)
    const deleted = await repo.findOne(id)
    await repo.remove(deleted)
    ctx.status = 204
  }
}

export default new UserRoute()
