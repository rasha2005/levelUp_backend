import express ,{ Express } from "express";
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from '../infrastructure/route/userRoute'

dotenv.config();

const app:Express = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true
}));

app.use(cookieParser());

app.use('/api/user',userRoute);

app.listen(PORT , () => {
    console.log(`server is running on http://localhost:${PORT}` )
})

