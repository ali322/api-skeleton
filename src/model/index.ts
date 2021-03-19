import { createConnection, Connection, getConnection } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { User } from './user'
import { Post, Tag, Comment } from './post'

export * from './user'
export * from './post'

export async function connectDB(): Promise<Connection> {
  const isTest = process.env.NODE_ENV === 'test'
  try {
    const conn = getConnection()
    if (conn.isConnected) {
      return conn
    }
  } catch (e) {
    return createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: !isTest,
      logging: !isTest,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [User, Post, Comment, Tag]
    })
  }
}
