import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '../user/user.entity'

export const checkJwt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the jwt token from the head
  const { cookies } = req
  const token = cookies.Authorization
  let jwtPayload
  const jwtSecret = process.env.SECRET !== undefined ? process.env.SECRET : ''

  // Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, jwtSecret) as User
    console.log(jwtPayload)
    res.locals.jwtPayload = jwtPayload
  } catch ({ message }) {
    // If token is not valid, respond with 401 (unauthorized)
    res.status(401).send({ error: message })
    return
  }

  // The token is valid for 1 hour
  // We want to send a new token on every request
  const { id, email } = jwtPayload
  const newToken = jwt.sign({ id, email }, jwtSecret, {
    expiresIn: '1h'
  })
  res.setHeader('token', newToken)

  // Call the next middleware or controller
  next()
}
