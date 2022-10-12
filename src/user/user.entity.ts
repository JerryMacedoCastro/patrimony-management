import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { IUser } from './user.interface'
import PatrimonyEntity from '../patrimony/patrimony.entity'

@Entity()
export default class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ nullable: false })
    name: string

  @Column({ nullable: false })
    email: string

  @Column({ nullable: false })
    password: string

  @OneToMany(() => PatrimonyEntity, patrimony => patrimony.user)
    patrimonies: PatrimonyEntity[]

  hashPassword (): void {
    this.password = bcrypt.hashSync(this.password, 10)
  }

  checkIfUnencryptedPasswordIsValid (unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }
}
