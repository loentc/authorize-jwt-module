/* eslint-disable @typescript-eslint/no-empty-function */
import { Request, Response } from "express"

export class UserController {
    constructor() { }

    async fecthApiUser(req: Request, res: Response) {
        return res.json(req.headers.fetchApi)
    }
}