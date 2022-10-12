import { IUser } from '../user/user.interface'

export interface IPatrimony {
  id: number

  name: string

  number: string

  location: string

  user: IUser
}
