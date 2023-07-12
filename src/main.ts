import express from 'express';
import UserRouter from './routes/user.route';
import dotenv from 'dotenv';
dotenv.config()

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.use(express.json())

app.use('/user', UserRouter)