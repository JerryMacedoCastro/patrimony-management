import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { IUser } from './user.interface'

@Entity()
export default class User implements IUser {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ nullable: false })
    name: string

  @Column({ nullable: false })
    email: string

  @Column({ nullable: false })
    password: string

  hashPassword (): void {
    this.password = bcrypt.hashSync(this.password, 10)
  }

  checkIfUnencryptedPasswordIsValid (unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }
}
