import express ,{ Express } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from '../infrastructure/route/userRoute'
import instructorRoute from '../infrastructure/route/instructorRoute'
import adminRoute from '../infrastructure/route/adminRoute'


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
app.use('/api/instructor',instructorRoute);
app.use('/api/admin',adminRoute);


app.listen(PORT , () => {
    console.log(`server is running on http://localhost:${PORT}` )
})

