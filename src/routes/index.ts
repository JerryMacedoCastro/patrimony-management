import { Router } from 'express'
import PatrimonyController from '../patrimony/patrimony.controller'
import multer from 'multer'
import multerConfig from '../config/upload'
import UserController from '../user/user.controller'

const patrimonyController = new PatrimonyController()
const userController = new UserController()
const routes = Router()
const upload = multer(multerConfig)

/**
 * @swagger
 * definitions:
 *   user:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *   patrimony:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       number:
 *         type: string
 *       location:
 *         type: string
 *       imagePath:
 *         type: string
 *   userRequestBody:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         : string
 *   patrimonyRequestBody:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       number:
 *         type: string
 *       location:
 *         type: string
 *       imagePath:
 *         type: string
 *   error:
 *     type: object
 *     properties:
 *       error:
 *         type: object
 *         properties:
 *           status:
 *             type: integer
 *           message:
 *             type: string
 *   imgLink:
 *       type: string
 */
routes.get('/', (_req, res) => {
  res.send('Hello darkness my old friend!')
})

/**
 * @swagger
 * /patrimony?id={id}:
 *   get:
 *     tags: [patrimony]
 *     description: return all patrimonies or a specific patrimony by id
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         required: false
 *         description: Numeric ID of the patrimony to get
 *     responses:
 *       200:
 *         description: Array of patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#definitions/patrimony'
 *       400:
 *         description: Error on getting patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.get('/patrimony/:id?', patrimonyController.Get)

/**
 * @swagger
 * /patrimony:
 *   post:
 *     tags: [patrimony]
 *     description: create a patrimony
 *     requestBody:
 *       description: Patrimony info to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#definitions/patrimonyRequestBody'
 *     responses:
 *       200:
 *         description: Array of patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/patrimony'
 *       400:
 *         description: Error on getting patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.post('/patrimony', patrimonyController.Create)

/**
 * @swagger
 * /patrimony/{id}:
 *   put:
 *     tags: [patrimony]
 *     description: update a patrimony
 *     requestBody:
 *       description: Patrimony info to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#definitions/patrimonyRequestBody'
 *     responses:
 *       200:
 *         description: Patrimony updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/patrimony'
 *       400:
 *         description: Error on getting patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.put('/patrimony/:id', patrimonyController.Update)

/**
 * @swagger
 * /patrimony/{id}:
 *   delete:
 *     tags: [patrimony]
 *     description: delete a patrimony
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         required: true
 *         description: Numeric ID of the patrimony
 *     responses:
 *       200:
 *         description: Patrimony deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/patrimony'
 *       400:
 *         description: Error on getting patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.delete('/patrimony/:id', patrimonyController.Delete)

/**
 * @swagger
 * /patrimonyimg/{id}:
 *   post:
 *     tags: [patrimony]
 *     description: add a image for patrimony
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         required: true
 *         description: Numeric ID of the patrimony of the img
 *     requestBody:
 *       description: Patrimony info to be created
 *       required: true
 *       content:
 *         image/*:    # Can be image/png, image/svg, image/gif, etc.
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Patrimony created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/patrimony'
 *       400:
 *         description: Error on getting patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.post('/patrimonyimg/:id', upload.single('image'), patrimonyController.CreateWithImage)

/**
 * @swagger
 * /patrimonyimg/{id}:
 *   get:
 *     tags: [patrimony]
 *     description: return all images from a specific patrimony
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the patrimony to get
 *     responses:
 *       200:
 *         description: Array of image links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#definitions/imgLink'
 *       400:
 *         description: Error on getting patrimonies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.get('/patrimonyimg/:id', patrimonyController.GetPatrimonyImages)

/**
 * @swagger
 * /user:
 *   post:
 *     tags: [user]
 *     description: create an user
 *     requestBody:
 *       description: user to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#definitions/userRequestBody'
 *     responses:
 *       200:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/user'
 *       400:
 *         description: Error on creating user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.post('/user', userController.createUser)

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [user]
 *     description: return all users or a specific user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         required: false
 *         description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#definitions/user'
 *       400:
 *         description: Error on getting users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/error'
 */
routes.get('/user/:userId?', userController.getUsers)

export default routes
