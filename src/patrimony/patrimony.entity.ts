import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IPatrimony } from './patrimony.interface'
import UserEntity from '../user/user.entity'

@Entity()
class PatrimonyEntity implements IPatrimony {
  @PrimaryGeneratedColumn()
    id: number

  @Column({
    length: 100
  })
    name: string

  @Column()
    number: string

  @Column()
    location: string

  @ManyToOne(() => UserEntity, user => user.patrimonies, {
    nullable: false
  })
    user: UserEntity
}

export default PatrimonyEntity
