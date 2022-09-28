/**
 * Required External Modules
 */
import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import 'reflect-metadata'
import AppDataSource from '../ormconfig'
import routes from './routes'

dotenv.config()
/**
 * App Variables
 */
if (process.env.PORT == null) {
  process.exit(1)
}

const PORT: number = parseInt(process.env.PORT, 10)

const app = express()

/**
 *  App Configuration
 */
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/v1', routes)

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log('Starting server...')

  AppDataSource.initialize()
    .then(() => {
      console.log('database connected')
    })
    .catch((error) => console.log(error))
  console.log(`Listening on port ${PORT}!`)
})
