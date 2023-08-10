/* eslint-disable @typescript-eslint/no-empty-function */
import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { TokenService } from "../service/token.service"

const prisma = new PrismaClient()

export class UserController {
    constructor() { }

    async fecthApiUser(req: Request, res: Response) {
        try {
            return res.json(req.headers.fetchApi)
        }
        catch (error) {
            return res.json(error)
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const { firstname, lastname, email, password } = req.body as { [key: string]: string }
            if (!(firstname && lastname && email && password)) {
                return res.status(400).json('Input is required!')
            }

            const haveUser = await prisma.user.findFirst({ where: { email } })
            if (haveUser?.email) {
                return res.status(409).json('User already exists')
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
            const tokenService = new TokenService()
            const accessToken = tokenService.generateToken(user.id);
            const refreshToken = tokenService.generateRefreshToken();
            Object.assign(user, { accessToken, refreshToken })

            return res.status(201).json(user)
        }
        catch (error) {
            return res.json(error)
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body as { [key: string]: string }
            if (!(email && password)) {
                return res.status(400).json('Input is required!')
            }

            // check validate
            const user = await prisma.user.findFirst({ where: { email } })
            const compareUser = await bcrypt.compare(password, user.password)
            if (user && compareUser) {
                // create token
                const tokenService = new TokenService()
                const accessToken = tokenService.generateToken(user.id);
                const refreshToken = tokenService.generateRefreshToken();
                Object.assign(user, { accessToken, refreshToken })

                return res.status(201).json(user)
            }
            return res.status(400).json('Invalid credentials!')
        }
        catch (error) {
            return res.json(error)
        }
    }

    async helloPage(req: Request, res: Response) {
        return res.send({ message: 'Hello API Express' });
    }

    async testTransation(req: Request, res: Response) {
        // 43a3ba5d-494d-46f7-80bb-9b7b23e88d1c
        try {
            const { firstname, lastname, email, password } = req.body as { [key: string]: string }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const createUserDto = {
                id: uuidv4(),
                firstname,
                lastname,
                email: email.toLowerCase(),
                password: hashedPassword
            }
            // const transaction1Result = await prisma.$transaction(async (prismaClient) => {
            //     const result = await prismaClient.user.create({ data: createUserDto });
            //     return { result }
            // })

            const transaction2Result = await prisma.$transaction(async (prismaClient) => {
                const sqlQuery = `
                UPDATE User
                SET email = 'abc999@gmail.com' 
                WHERE id = '43a3ba5d-494d-46f7-80bb-9b7b23e88d1c'
                `;
                return await prismaClient.$queryRaw` UPDATE User
                SET email = 'abc999@gmail.com' 
                WHERE id = '43a3ba5d-494d-46f7-80bb-9b7b23e88d1c'`;
            })
            console.log(transaction2Result)


            return res.json('Create Success: ')
        }
        catch (err) {
            return res.json(err)
        }

    }
}