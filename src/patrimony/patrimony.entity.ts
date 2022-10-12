import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { IPatrimony } from './patrimony.interface'

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

  @ManyToOne(() => User, user => user.patrimonies, {
    nullable: false
  })
    user: User
}

export default PatrimonyEntity
