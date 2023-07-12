/* eslint-disable @typescript-eslint/no-empty-function */
import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class UserController {
    constructor() { }

    async fecthApiUser(req: Request, res: Response) {
        return res.json(req.headers.fetchApi)
    }

    async createUser(req: Request, res: Response) {
        try {
            const { firstname, lastname, email, password } = req.body as { [key: string]: string }
            if (!(firstname && lastname && email && password)) {
                res.status(400).json('Input is required!')
            }

            const haveUser = await prisma.user.findFirst({ where: { email } })
            if (haveUser?.email) {
                res.status(409).json('User already exists')
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const createUserDto = {
                id: uuidv4(),
                firstname,
                lastname,
                email: email.toLowerCase(),
                password: hashedPassword
            }
            const user = await prisma.user.create({ data: createUserDto })

            // create token
            const token = jwt.sign(
                { user_id: user.id, email }, process.env.TOKEN_KEY, { expiresIn: '1h' }
            )
            Object.assign(user, { token })
            res.status(201).json(user)
        }
        catch (error) {
            res.json(error)
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body as { [key: string]: string }
            if (!(email && password)) {
                res.status(400).json('Input is required!')
            }

            // check validate
            const user = await prisma.user.findFirst({ where: { email } })
            const compareUser = await bcrypt.compare(password, user.password)
            if (user && compareUser) {
                // create token
                const token = jwt.sign(
                    { user_id: user.id, email }, process.env.TOKEN_KEY, { expiresIn: '1h' }
                )
                Object.assign(user, { token })
                res.status(201).json(user)
            }
            res.status(400).json('Invalid credentials!')
        }
        catch (error) {
            res.json(error)
        }
    }

    async helloPage(req: Request, res: Response) {
        res.send({ message: 'Hello API Express' });
    }
}