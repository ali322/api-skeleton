import { BaseContext } from 'koa';
import { ValidationError, validate } from 'class-validator';
import { Repository, getManager } from 'typeorm';
import { Get, Post} from '../lib/decorator'
import { Post as PostModel } from '../model';
import { formatedValidationError } from '../lib/formater';

class Forum{
  @Get('/posts')
  async posts(ctx: BaseContext): Promise<void> {
    const postRepo: Repository<PostModel> = getManager().getRepository(PostModel)
    const posts: PostModel[] = await postRepo.find()

    ctx.body = posts
  }

  @Post('/post')
  async createPost(ctx: BaseContext): Promise<void> {
    const postRepo: Repository<PostModel> = getManager().getRepository(PostModel)
    const { title, content } = ctx.request.body
    const post: PostModel = new PostModel()
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


export default new Forum()