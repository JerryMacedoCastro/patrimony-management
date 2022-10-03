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
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import path from 'path'

dotenv.config()

/**
 * API Documentation
 */
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Patrimony API',
      version: '1.0.0'
    }
  },
  apis: [path.join(__dirname, '/routes/index.ts')]

}

/**
 * App Variables
 */
if (process.env.PORT == null) {
  console.log('You need to configure the env vars')
  process.exit(1)
}

const PORT: number = parseInt(process.env.PORT, 10)

const app = express()

/**
 *  App Configuration
 */
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/v1', routes)

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
