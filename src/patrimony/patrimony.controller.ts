import { Request, Response } from 'express'
import AppDataSource from '../../ormconfig'
import S3Storage from '../utils/S3Storage'
import PatrimonyEntity from './patrimony.entity'
import { IPatrimony } from './patrimony.interface'

class PatrimonyController {
  async Get (request: Request, response: Response): Promise<Response> {
    try {
      const params = request.query
      const { id } = params
      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)
      let res
      if (id === '0' || id === undefined) {
        res = await patrimonyRepository.find()
      } else {
        res = await patrimonyRepository.findOneBy({ id: Number(id) })
      }

      return response.status(200).send(res !== null ? res : [])
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }

  async Create (request: Request, response: Response): Promise<Response> {
    try {
      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)
      const { name, number, location }: IPatrimony = request.body

      const isExistingPatrimony = await patrimonyRepository.findOneBy({
        name
      })

      if (isExistingPatrimony != null) throw new Error('The given patrimony already exists')

      const newPatrimony = patrimonyRepository.create({ name, number, location })
      await patrimonyRepository.save(newPatrimony)

      return response.status(200).send(newPatrimony)
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }

  async CreateWithImage (request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params
      const { file } = request
      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)
      const patrimony = await patrimonyRepository.findOneBy({
        id: Number(id)
      })
      if (patrimony === null) { return response.status(400).send({ error: 'Patrimony not found' }) }
      if (file === undefined) { return response.status(400).send({ error: 'file must be sent' }) }
      const s3 = new S3Storage()
      console.log(s3)
      await s3.saveFile(file.filename, id)

      return response.json({ success: true })
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }

  async Update (request: Request, response: Response): Promise<Response> {
    try {
      const params = request.params
      const { id } = params
      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)
      const { name, number, location }: IPatrimony = request.body

      if (name === undefined) throw new Error('Propert name is required!')
      if (number === undefined) throw new Error('Propert number is required!')
      if (location === undefined) throw new Error('Propert location is required!')

      const patrimonyToUpdate = await patrimonyRepository.findOneByOrFail({
        id: Number(id)
      })

      patrimonyToUpdate.name = name
      patrimonyToUpdate.location = location
      patrimonyToUpdate.number = number

      await patrimonyRepository.save(patrimonyToUpdate)

      return response.status(200).send(patrimonyToUpdate)
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }

  async Delete (request: Request, response: Response): Promise<Response> {
    try {
      const params = request.params
      const { id } = params
      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)

      const patrimony = await patrimonyRepository.findOneByOrFail({
        id: Number(id)
      })

      await patrimonyRepository.remove(patrimony)

      return response.status(200).send({ removed: patrimony })
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }
}

export default PatrimonyController
