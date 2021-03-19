import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
  AfterLoad,
  AfterUpdate
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import * as dayjs from 'dayjs'

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn('varchar', { length: 150 })
  @IsNotEmpty()
  id: string

  @Column()
  @IsNotEmpty()
  username: string

  @Column('varchar', { length: 200 })
  email: string

  @Column('text', { default: '' })
  avatar: string

  @Column('datetime', { nullable: true })
  lastLoginedAt: Date

  @Column('text')
  password: string

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
