/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { FecthDataDto } from '../dto/data.dto';

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
            next();
        } catch (error) {
            res.status(500).send(`Cant't fetching data`);
        }
    }
}