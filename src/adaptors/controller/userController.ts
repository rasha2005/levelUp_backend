import { Request, Response, NextFunction } from "express";
import userUseCase from "../../usecase/userUseCase";
import dotenv from 'dotenv';
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

class userController {
    constructor(private useCase:userUseCase){}

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
           

            const { email } = req.body;
            const user = req.body

            const response = await this.useCase.findUser(user);

            if(response.success === true) {
                return res.status(200).json({ success: true ,token:response.token});
            }else{
                return res.status(200).json({success:false , message:"user found"})
            }

        }catch (err) {
            next(err);
        }
    }

    async verifyUserOtp(req: Request, res: Response, next: NextFunction) {
        try {

            const {userOtp , token} = req.body;

            const response = await this.useCase.saveUser(userOtp , token);
            if(response) {
                return res.status(200).json(response);
            }

        }catch (err) {
            next(err);
        }
    }

    async verifyLogin(req:Request ,  res: Response, next: NextFunction) {
        try{
            const {email , password} = req.body;
            const response = await this.useCase.verifyLogin(email , password);
            console.log("kkkkk",response);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async home(req:Request ,  res: Response, next: NextFunction) {
        try {
            const response = await this.useCase.getCateogries();
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

    async profile(req:Request ,  res: Response, next: NextFunction ){
        try {

            const decodedToken = req.app.locals.decodedToken;
            const response = await this.useCase.getUserDetails(decodedToken);
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

    async updateUser(req:Request ,  res: Response, next: NextFunction ) {
        try{
            const {id , name  , mobile} = req.body;
            const response = await this.useCase.updateUserDetails(id , name  , mobile);
            return res.status(200).json({response});

        }catch(err) {
           next(err);
        }
    }

    async getInstructorData(req:Request ,  res: Response, next: NextFunction) {
        try{
            const page = parseInt(req.query.page as string) || 1; 
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.searchTerm || null
            const category = req.query.category || null
            console.log("search" , search);

            const response = await this.useCase.getInstructorDetails(page , limit , search , category);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async resendInstructorOtp(req:Request , res:Response , next:NextFunction){
        try {
            const {token} = req.body;
    
            const response = await this.useCase.resendOtpByEmail(token);
            res.status(200).json({response});
        }catch(err) {
            next(err);
        }
       }

       async changePassword(req:Request , res:Response , next:NextFunction){
        try {
            const decodedToken = req.app.locals.decodedToken;
            const {current , confirm} = req.body;
    
            const response = await this.useCase.changeUserPassword(decodedToken , current , confirm);
            res.status(200).json({response});
        }catch(err) {
            next(err);
        }
       }

       async getInstructor(req:Request , res:Response , next:NextFunction) {
        try{
          
            const id = req.query.id;
            const token = req.query.token as string
            const response = await this.useCase.getInstructorDetail(id,token);
            
            return res.status(200).json({response})
        }catch(err) {
            next(err);
        }
       } 

       async payement(req:Request , res:Response , next:NextFunction) {
        try{
            const {session , instructorId} = req.body;
            const token = req.cookies.authToken;
            const {title , price , start , end , id ,scheduledSessionId
            } = session

            const roomId = uuidv4();

            const info = {
                instructorId,
                title,
                price ,
                start ,
                end ,
                id ,
                scheduledSessionId,
                roomId
            }

            const response = await  this.useCase.payement(info , token)
           
            return res.status(200).json({ success: true, data: response });


        }catch (err) {
            next(err);
        }
       }

       async stripeWebhook(req:Request , res:Response , next:NextFunction) {

        const endpointSecret = process.env.WEBHOOK_SECRET!.toString();
        
        const sig = req.headers['stripe-signature'];
        if (!sig) {
            res.status(400).send('Missing Stripe signature header');
            return;
        } 
        let event;
        try {
            
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            
          } catch (err: any) {
            console.error('Error verifying webhook signature:', err);
            
          }

        switch (event?.type) {
            case "checkout.session.completed":
             
              const session = event.data.object;
              await this.useCase.successPayment(session);
              break;

        default:
        console.log(`Unhandled event type: ${event?.type}`);
      
       }
   
}

    async getSlots(req:Request , res:Response , next:NextFunction) {
        try{
            const decodedToken = req.app.locals.decodedToken;
           
            const response = await this.useCase.getSlotDetails(decodedToken);
            return res.status(200).json({response});
        }catch(err){
            next(err);
        }
    }

    async setImg(req:Request , res:Response , next:NextFunction) {
        try{
            const token = req.cookies.authToken;
            const {img} = req.body;
            
            const response = await this.useCase.updateUserImg(token , img);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getImg(req:Request , res:Response , next:NextFunction) {
        try {
            
            const decodedToken = req.app.locals.decodedToken;
            const response = await this.useCase.getUserImg(decodedToken);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async verifyRoom(req:Request , res:Response , next:NextFunction) {
        try {
            const roomId =  req.query.roomId as string;
            const userId = req.query.userId as string
            
            const response = await this.useCase.verifyRoomId(roomId , userId);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async rating(req:Request , res:Response , next:NextFunction) {
        try{
            const rating  = req.body.rating as number
            const id  = req.body.id as string;
            
            const response = await this.useCase.updateRating(rating , id);
            return res.status(200).json({response});


        }catch(err) {
            next(err);
        }
    }

    async googleAuth(req:Request , res:Response , next:NextFunction) {
        try{
            const email  = req.body.email as string;
            const name  = req.body.name as string
            const img  = req.body.img as string
            const response = await this.useCase.googleCallback(email , name , img);
            
            
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async addReview(req:Request , res:Response , next:NextFunction) {
        try{
            const instructorId  = req.body.instructorId as string;
            const value  = req.body.value ;
            const decodedToken = req.app.locals.decodedToken;
            const response = await this.useCase.addInstructorReview(instructorId , value , decodedToken);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async refreshToken(req:Request , res:Response , next:NextFunction) {
        try{
            
            const refreshToken = req.cookies.refreshToken;
            const response = await this.useCase.verifyRefreshToken(refreshToken);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

}


export default userController;