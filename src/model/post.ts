import {Entity, Column, PrimaryGeneratedColumn, BaseEntity} from 'typeorm'
import { Length, IsDate, IsNotEmpty } from 'class-validator'

/**
 * @apiDefine PostModel
 * @apiSuccess {number} id
 * @apiSuccess {string} title
 */
@Entity()
export class Post extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(10, 20)
  title: string

  @Column('text')
  @IsNotEmpty()
  content: string

  @Column('date')
  @IsDate()
  created: Date
}

@Entity()
export class Tag extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(0, 10)
  @IsNotEmpty()
  name: string
}

@Entity()
export class Comment extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  @IsNotEmpty()
  content: string

  @Column('date')
  @IsDate()
  created: Date
}