import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import AppDataSource from '../../ormconfig'

import User from '../user/user.entity'

class AuthController {
  async login (request: Request, response: Response): Promise<Response> {
    // Check if username and password are set
    const { email, password } = request.body

    // Get user from database
    const userRepository = AppDataSource.getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { email } })
    } catch ({ message }) {
      return response.status(401).send({ error: message })
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return response.status(401).send({ error: 'wrong e-mail or password ' })
    }
    const jwtSecret = (process.env.SECRET !== undefined) ? process.env.SECRET : ''
    // Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    )

    // Send the jwt in the response
    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    })
  }

  async changePassword (
    request: Request,
    response: Response
  ): Promise<Response> {
    // Get ID from JWT
    const id = response.locals.jwtPayload.userId

    // Get parameters from the body
    const { oldPassword, newPassword } = request.body

    // Get user from the database
    const userRepository = AppDataSource.getRepository(User)
    let user: User | null
    try {
      user = await userRepository.findOneBy(id)
    } catch (id) {
      return response.status(401).send()
    }

    if (user === null) return response.status(401).send({ error: 'user not found' })

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      return response.status(401).send({ error: 'Wrong password' })
    }

    user.password = newPassword

    // Hash the new password and save
    user.hashPassword()
    await userRepository.save(user)

    return response.status(204).send({ message: 'Password upated' })
  }

  async logout (
    _request: Request,
    response: Response
  ): Promise<Response> {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0'])
    return response.status(200).send({ message: 'Loged out' })
  }
}
export default AuthController
