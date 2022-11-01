import { DataSource } from 'typeorm'
import Patrimony from './src/patrimony/patrimony.entity'
import User from './src/user/user.entity'
import * as dotenv from 'dotenv'

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: 'postgres',
  password: 'example',
  database: 'postgres',
  entities: [Patrimony, User],
  synchronize: true
})

export default AppDataSource
