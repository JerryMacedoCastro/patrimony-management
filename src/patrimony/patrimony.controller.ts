import { Request, Response } from 'express'
import AppDataSource from '../../ormconfig'
import PatrimonyEntity from './patrimony.entity'
import { IPatrimony } from './patrimony.interface'

class PatrimonyController {
  async Get (request: Request, response: Response): Promise<Response> {
    try {
      const params = request.params
      const { id } = params
      const patrimonyRepository = AppDataSource.getRepository(PatrimonyEntity)
      let res
      if (params != null) {
        res = await patrimonyRepository.findOneBy({ id: Number(id) })
      } else {
        res = await patrimonyRepository.find()
      }

      return response.status(200).send(res)
    } catch ({ message }) {
      return response.status(400).send(message)
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
      return response.status(400).send({ message })
    }
  }
}

export default PatrimonyController
