import { Router } from 'express'
import PatrimonyController from '../patrimony/patrimony.controller'

const patrimonyController = new PatrimonyController()
const routes = Router()

routes.get('/', (_req, res) => {
  res.send('Hello darkness my old friend!')
})

routes.post('/patrimony', patrimonyController.Create)
routes.put('/patrimony/:id', patrimonyController.Update)
routes.get('/patrimony/:id?', patrimonyController.Get)
routes.delete('/patrimony/:id', patrimonyController.Delete)

export default routes