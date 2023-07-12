import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { MiddlewareHandler } from "../middleware/middleware-handler";

const UserRouter = Router()
const userController = new UserController()
const middlewareHandler = new MiddlewareHandler()

UserRouter.post('/register', userController.createUser)

UserRouter.post('/login', userController.login)

UserRouter.get('/', middlewareHandler.verifyToken, userController.helloPage)

UserRouter.get('/fetch-data', middlewareHandler.modifyUser, userController.fecthApiUser)

export default UserRouter