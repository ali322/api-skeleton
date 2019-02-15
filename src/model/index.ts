import { createConnection } from 'typeorm'
import { join } from 'path'

import { Post, Tag, Comment } from './post'
export * from './post'

export async function connectDB(): Promise<void> {
  await createConnection({
    type: 'sqlite',
    database: join(__dirname, '..', 'data', 'demo.db'),
    synchronize: true,
    logging: true,
    entities: [Post, Tag, Comment]
  })
}
