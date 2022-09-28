import { DataSource } from 'typeorm'
import Patrimony from './src/patrimony/patrimony.entity'
import * as dotenv from 'dotenv'

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Patrimony],
  synchronize: true
})

export default AppDataSource
