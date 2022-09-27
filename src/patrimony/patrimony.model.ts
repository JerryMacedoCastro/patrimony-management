import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Patrimony {
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
