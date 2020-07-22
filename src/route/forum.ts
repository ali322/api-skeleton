import { BaseContext } from 'koa';
import { ValidationError, validate } from 'class-validator';
import { Repository, getManager } from 'typeorm';
import { route, middleware, namespace } from '../lib/decorator'
import { guard } from '../middleware'
import { Post } from '../model';
import { formatedValidationError } from '../lib/formater';

@namespace('/api/v1')
class ForumRoute{
  @route('get', '/posts')
  @middleware(guard({
    query: {
      page: 'required',
      limit: 'required',
    } 
  }))
  async posts(ctx: BaseContext): Promise<void> {
    const postRepo: Repository<Post> = getManager().getRepository(Post)
    const posts: Post[] = await postRepo.find()

    ctx.body = posts
  }

  @route('post', '/post')
  async createPost(ctx: BaseContext): Promise<void> {
    const postRepo: Repository<Post> = getManager().getRepository(Post)
    const { title, content } = ctx.request.body
    const post: Post = new Post()
    post.title = title
    post.content = content
    post.created = new Date()
    const errs: ValidationError[] = await validate(post)
    if (errs.length > 0) {
      ctx.status = 400
      ctx.body = formatedValidationError(errs)
    } else {
      const saved = await postRepo.save(post)
      ctx.status = 201
      ctx.body = saved
    }
  }
}


export default new ForumRoute()