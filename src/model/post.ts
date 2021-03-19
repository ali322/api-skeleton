import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  AfterInsert,
  AfterUpdate
} from 'typeorm'
import { Length, IsDate, IsNotEmpty } from 'class-validator'
import * as dayjs from 'dayjs'

/**
 * @apiDefine PostModel
 * @apiSuccess {number} id
 * @apiSuccess {string} title
 */
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(10, 20)
  title: string

  @Column('text')
  @IsNotEmpty()
  content: string

  @CreateDateColumn()
  createdAt: Date | string

  @UpdateDateColumn()
  updatedAt: Date | string

  @AfterLoad()
  loadDate(): void {
    this.createdAt = dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
    this.updatedAt = dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  }
  @AfterInsert()
  insertDate(): void {
    this.createdAt = dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
    this.updatedAt = dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  }
  @AfterUpdate()
  updateDate(): void {
    this.createdAt = dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
    this.updatedAt = dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  }
}

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(0, 10)
  @IsNotEmpty()
  name: string
}

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  @IsNotEmpty()
  content: string

  @Column('date')
  @IsDate()
  created: Date
}
