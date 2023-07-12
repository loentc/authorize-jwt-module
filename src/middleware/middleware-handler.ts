/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { FecthDataDto } from '../dto/data.dto';
import jwt from 'jsonwebtoken'


export class MiddlewareHandler {
    constructor() { }

    async modifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const fetchApiResult = await axios.get<FecthDataDto>('https://reqres.in/api/users?page=1');

            const addFullname = fetchApiResult.data.data.map(item => ({
                ...item,
                fullname: `${item.first_name} ${item.last_name}`
            }));
            fetchApiResult.data.data = addFullname
            Object.assign(req.headers, { fetchApi: fetchApiResult.data })
            next()
        } catch (error) {
            res.status(500).send(`Cant't fetching data`);
        }
    }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.body.token || req.query.token || req.headers['authorization']
        if (!token) {
            res.status(403).json('A token is required for authentication!')
        }

        try {
            const decode = jwt.verify(token, process.env.TOKEN_KEY)
            Object.assign(req, { decode })

            this.modifyUser(req, res, next)
        }
        catch (error) {
            res.status(401).json('Invalid token')
        }
        return next()
    }
}