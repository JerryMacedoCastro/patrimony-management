import { Request, Response } from 'express'
import AppDataSource from '../../ormconfig'
import User from './user.entity'

class UserController {
  async createUser (
    request: Request,
    response: Response
  ): Promise<Response> {
    const { email, name, password } = request.body

    try {
      const userRepository = AppDataSource.getRepository(User)
      const isExistingUser = await userRepository.findOneBy({ email })

      if (isExistingUser != null) { throw new Error('The email already exists!!') }

      const user = userRepository.create({
        name,
        email,
        password
      })
      user.hashPassword()
      const res = await userRepository.save(user)

      return response.status(201).send(res)
    } catch ({ message }) {
      return response.status(400).send(message)
    }
  }

  async getUsers (
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const { userId } = request.params

      const userRepository = AppDataSource.getRepository(User)
      if (userId !== undefined && userId !== '0') {
        const user = await userRepository.findOneBy({ id: Number(userId) })
        if (user != null) return response.status(200).send(user)
        throw new Error('User not found')
      }
      const allUsers = await userRepository.find()

      return response.status(200).send(allUsers)
    } catch ({ message }) {
      return response.status(400).send(message)
    }
  }
}

export default UserController
