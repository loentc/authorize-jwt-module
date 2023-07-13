/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { FecthDataDto } from '../dto/data.dto';
import jwt from 'jsonwebtoken'

export class MiddlewareHandler {
    constructor() { }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const authorizationToken = (req.headers['authorization'] as string)?.replace('Bearer ', '')
        const token = req.body.token || req.query.token || authorizationToken
        if (!token) {
            return res.status(403).json('A token is required for authentication!')
        }

        try {
            const decode = jwt.verify(token, process.env.TOKEN_KEY)
            Object.assign(req, { decode })

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
                return res.status(500).send(`Cant't fetching data`);
            }
            next()
        }
        catch (error) {
            return res.status(401).json('Invalid token')
        }
    }
}