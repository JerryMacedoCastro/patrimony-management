import { Router } from 'express'
import PatrimonyController from '../patrimony/patrimony.controller'

const patrimonyController = new PatrimonyController()
const routes = Router()

/**
 * @swagger
 *  /api/v1:
 *    get:
 *      description: Say hello
 *      responses:
 *        200:
 *          description: Success
 */
routes.get('/', (_req, res) => {
  res.send('Hello darkness my old friend!')
})

/**
 * @swagger
 * /patrimony:
 *   post:
 *     description: Create a new patrimony
 *     parameters:
 *      - name: patrimony's name
 *      - number: number of the patrimony
 *      - location: address of the patrimony
 *        in: json
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Created
 */
routes.post('/patrimony', patrimonyController.Create)
routes.put('/patrimony/:id', patrimonyController.Update)
routes.get('/patrimony/:id?', patrimonyController.Get)
routes.delete('/patrimony/:id', patrimonyController.Delete)

export default routes
