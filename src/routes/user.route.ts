import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { MiddlewareHandler } from "../middleware/middle-handler";

const UserRouter = Router()
const userController = new UserController()
const middlewareHandler = new MiddlewareHandler()

UserRouter.get('/fecthData', middlewareHandler.modifyUser, userController.fecthApiUser)

export default UserRouter