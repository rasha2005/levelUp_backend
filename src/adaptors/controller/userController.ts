import { Request, Response, NextFunction, request } from "express";
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
            console.log("its hereee yayayaya")
            console.log("req.body",req.body.email)

            const { email } = req.body;
            const user = req.body

            const response = await this.useCase.findUser(user);

            console.log("resdksjakdl" , response);
            if(response.success === true) {
                console.log("kkkkkk",response.token);
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

            console.log("user" , userOtp);
            console.log("tokenn" , token);

            const response = await this.useCase.saveUser(userOtp , token);
            if(response) {
                console.log("kkkkk",response);
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
                secure: true, // Use only in HTTPS
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

            const token = req.cookies.authToken;
            const response = await this.useCase.getUserDetails(token);
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
            console.log("toe" , token);
    
            const response = await this.useCase.resendOtpByEmail(token);
            console.log("respose" , response);
            res.status(200).json({response});
        }catch(err) {
            next(err);
        }
       }

       async changePassword(req:Request , res:Response , next:NextFunction){
        try {
            const token = req.cookies.authToken;
            const {current , confirm} = req.body;
            console.log("toe" , token);
    
            const response = await this.useCase.changeUserPassword(token , current , confirm);
            console.log("respose" , response);
            res.status(200).json({response});
        }catch(err) {
            next(err);
        }
       }

       async getInstructor(req:Request , res:Response , next:NextFunction) {
        try{
          
            const id = req.query.id;
            const token = req.query.token
            console.log("token",token);
          
            console.log("idd" , id);
            const response = await this.useCase.getInstructorDetail(id,token);
            console.log("response" , response);
            return res.status(200).json({response})
        }catch(err) {
            next(err);
        }
       } 

       async payement(req:Request , res:Response , next:NextFunction) {
        try{
            const {session , instructorId} = req.body;
            const token = req.cookies.authToken;
            console.log("jjj" , token)
            console.log("event" , session);
            console.log("event" , instructorId);
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
            console.log("Payment session URL:", response);
            return res.status(200).json({ success: true, data: response });


        }catch (err) {
            next(err);
        }
       }

       async stripeWebhook(req:Request , res:Response , next:NextFunction) {

        const endpointSecret = process.env.WEBHOOK_SECRET!.toString();
        console.log("rnd" , endpointSecret);
        const sig = req.headers['stripe-signature'];
        if (!sig) {
            res.status(400).send('Missing Stripe signature header');
            return;
        } 
        let event;
        try {
            // Construct the Stripe event
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Event received:", event);
          } catch (err: any) {
            console.error('Error verifying webhook signature:', err);
            // res.status(400).send(`Webhook Error: ${err.message}`);
            // return;
          }

        switch (event?.type) {
            case "checkout.session.completed":
              console.log("Inside checkout.session.completed");
              const session = event.data.object;
              await this.useCase.successPayment(session);
              break;

        default:
        console.log(`Unhandled event type: ${event?.type}`);
      
       }
    //    return res.status(200).json({ received: true });
}

    async getSlots(req:Request , res:Response , next:NextFunction) {
        try{
            const token =  req.query.token;
            console.log("token",token);
            const response = await this.useCase.getSlotDetails(token);
            return res.status(200).json({response});
        }catch(err){
            next(err);
        }
    }

    async setImg(req:Request , res:Response , next:NextFunction) {
        try{
            const token = req.cookies.authToken;
            const {img} = req.body;
            console.log("img" , img);
            const response = await this.useCase.updateUserImg(token , img);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getImg(req:Request , res:Response , next:NextFunction) {
        try {
            const token =  req.cookies.authToken
            console.log("tokeeenccccc" , token);
            const response = await this.useCase.getUserImg(token);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async verifyRoom(req:Request , res:Response , next:NextFunction) {
        try {
            const roomId =  req.query.roomId;
            const userId = req.query.userId
            console.log('uu' , roomId , userId);
            const response = await this.useCase.verifyRoomId(roomId , userId);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async rating(req:Request , res:Response , next:NextFunction) {
        try{
            const {rating , id} = req.body;
            const response = await this.useCase.updateRating(rating , id);
            return res.status(200).json({response});


        }catch(err) {
            next(err);
        }
    }

    async googleAuth(req:Request , res:Response , next:NextFunction) {
        try{
            const {email , name , img} = req.body;
            const response = await this.useCase.googleCallback(email , name , img);
            console.log('res' , response);
            res.cookie("123", response.authToken, {
                sameSite:"lax",
                maxAge:15 * 60 * 1000, // 15 min
              });
            
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async addReview(req:Request , res:Response , next:NextFunction) {
        try{
            const {instructorId , value} = req.body;
            const token = req.cookies.authToken;
            const response = await this.useCase.addInstructorReview(instructorId , value , token);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async refreshToken(req:Request , res:Response , next:NextFunction) {
        try{
            
            const refreshToken = req.cookies.refreshToken;
            const response = await this.useCase.verifyRefreshToken(refreshToken);
            console.log("respo" , response);
            if(response.success) {
                res.cookie("authToken", response.authToken, {
                    httpOnly: true,
                    secure: true, 
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                  });
            }
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

}


export default userController;