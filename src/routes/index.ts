import { Router } from 'express'
import PatrimonyController from '../patrimony/patrimony.controller'
import multer from 'multer'
import multerConfig from '../config/upload'

const patrimonyController = new PatrimonyController()
const routes = Router()
const upload = multer(multerConfig)

routes.get('/', (_req, res) => {
  res.send('Hello darkness my old friend!')
})
routes.post('/patrimony', patrimonyController.Create)
routes.post('/patrimonyimg', upload.single('image'), patrimonyController.CreateWithImage)
routes.put('/patrimony/:id', patrimonyController.Update)
routes.get('/patrimony/:id?', patrimonyController.Get)
routes.delete('/patrimony/:id', patrimonyController.Delete)

export default routes
