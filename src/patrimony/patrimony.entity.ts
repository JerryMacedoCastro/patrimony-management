import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
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
}

export default PatrimonyEntity
