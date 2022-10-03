"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patrimony_controller_1 = __importDefault(require("../patrimony/patrimony.controller"));
const patrimonyController = new patrimony_controller_1.default();
const routes = (0, express_1.Router)();
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
    res.send('Hello darkness my old friend!');
});
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
routes.post('/patrimony', patrimonyController.Create);
routes.put('/patrimony/:id', patrimonyController.Update);
routes.get('/patrimony/:id?', patrimonyController.Get);
routes.delete('/patrimony/:id', patrimonyController.Delete);
exports.default = routes;
