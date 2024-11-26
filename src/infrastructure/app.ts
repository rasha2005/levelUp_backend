import express ,{ Express , NextFunction, Request, Response} from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './route/userRoute'
import instructorRoute from './route/instructorRoute'
import adminRoute from './route/adminRoute'
import startCronJob from "./service/node-cron";


dotenv.config();

const app:Express = express();


app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/api/user/webhook') {
      express.raw({type: 'application/json'})(req, res, next);
    } else {
      express.json()(req, res, next);
    }
  });

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true,
}));

app.use(cookieParser());

app.use('/api/user',userRoute);
app.use('/api/instructor',instructorRoute);
app.use('/api/admin',adminRoute);

startCronJob();

app.listen(PORT , () => {
   
    console.log(`server is running on http://localhost:${PORT}` )
})

