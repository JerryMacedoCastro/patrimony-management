import { Request, Response } from 'express'
import AppDataSource from '../../ormconfig'
import UserEntity from '../user/user.entity'
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
        res = await patrimonyRepository.find({ relations: ['user'] })
      } else {
        res = await patrimonyRepository.findOneBy({ relations: ['user'], where: { id: Number(id) } })
      }

      return response.status(200).send(res !== null ? res : [])
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }

  async Create (request: Request, response: Response): Promise<Response> {
    try {
      const { name, number, location, userId } = request.body

      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)
      const userRepository = AppDataSource.getRepository(UserEntity)
      const isExistingPatrimony = await patrimonyRepository.findOneBy({
        name
      })

      const isExistingUser = await userRepository.findOneBy({
        id: Number(userId)
      })

      if (isExistingPatrimony !== null) throw new Error('The given patrimony already exists')
      if (isExistingUser === null) throw new Error('The given user does not exist')

      const newPatrimony = patrimonyRepository.create({ name, number, location, user: isExistingUser })
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
      if (file === undefined) { return response.status(400).send({ error: 'file must be sent!' }) }
      const s3 = new S3Storage()
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

      const s3 = new S3Storage()
      const content = await s3.getImagesFromFolder(id)
      if (content !== undefined) {
        content.forEach(async (item) => {
          if (item.Key !== undefined) { await s3.deleteFile(item.Key) }
        })
      }

      await patrimonyRepository.remove(patrimony)

      return response.status(200).send({ removed: patrimony })
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }

  async GetPatrimonyImages (request: Request, response: Response): Promise<Response> {
    try {
      const params = request.params
      const { id } = params
      const s3 = new S3Storage()
      const links = await s3.getFile(id)
      if (links === undefined) return response.status(200).send([])

      return response.status(200).send(links)
    } catch ({ message }) {
      return response.status(400).send({ error: message })
    }
  }
}

export default PatrimonyController
