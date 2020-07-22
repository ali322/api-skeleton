import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class User extends BaseEntity{
  @PrimaryColumn("varchar", { length: 150 })
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
}