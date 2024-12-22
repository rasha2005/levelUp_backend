import express ,{ Express , NextFunction, Request, Response} from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './route/userRoute'
import instructorRoute from './route/instructorRoute'
import adminRoute from './route/adminRoute'
import chatRoute from './route/chatRoute'
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

app.use(
  cors({ 
    origin: process.env.BASE_URL, 
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    
  })
);



app.use(cookieParser());

app.use('/api/user',userRoute);
app.use('/api/instructor',instructorRoute);
app.use('/api/admin',adminRoute);
app.use('/api/chat',chatRoute)

startCronJob();

const server = app.listen(PORT , () => {
   
    console.log(`server is running on http://localhost:${PORT}` )
})

const io = require('socket.io')(server , {
  pingTimeout:60000,
  cors:{
    origin:process.env.FRONT_URL,
  },
})

io.on("connection" , (socket:any) => {
  console.log("connected to socket.io")

  socket.on('setup' , (user:any) => {
    console.log("hehe" ,user.id)
    socket.join(user.id);
    socket.emit('connected')
  })

  socket.on('join chat' , (room:any) => {
    socket.join(room);
    console.log("user joined room" , room)
    
  })
  socket.on('new message' , (newMessageReceived:any) => {

    console.log("chatw" , newMessageReceived)
    
  const { chat, senderId } = newMessageReceived;

  const recipientId =
    chat.userId === senderId ? chat.instructorId : chat.userId;
    
    socket.in(recipientId).emit("message recived" , newMessageReceived)

    
  })
})

