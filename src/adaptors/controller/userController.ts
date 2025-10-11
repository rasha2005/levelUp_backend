import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";

import dotenv from 'dotenv';
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import {UserUseCase} from "../../usecase/userUseCase";
import { StatusCode } from "../../enums/statuscode";
import { Messages } from "../../enums/message";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

@injectable()
export class UserController {
    constructor(@inject("UserUseCase") private _useCase:UserUseCase){}

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
           

            const user = req.body

            const response = await this._useCase.findUser(user);

            if(response.success === true) {
                return res.status(StatusCode.OK).json({ success: true ,token:response.token});
            }else{
                return res.status(StatusCode.OK).json({success:false , message:Messages.FAILED})
            }

        }catch (err) {
            next(err);
        }
    }

    async verifyUserOtp(req: Request, res: Response, next: NextFunction) {
        try {

            const {userOtp , token} = req.body;

            const response = await this._useCase.saveUser(userOtp , token);
            if(response) {
                return res.status(StatusCode.OK).json(response);
            }

        }catch (err) {
            next(err);
        }
    }

    async verifyLogin(req:Request ,  res: Response, next: NextFunction) {
        try{
            const {email , password} = req.body;
            const response = await this._useCase.verifyLogin(email , password);
            const REFRESH_MAXAGE = parseInt(process.env.REFRESH_MAXAGE!);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                domain: ".levelup.icu",
                maxAge: REFRESH_MAXAGE
              });
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async home(req:Request ,  res: Response, next: NextFunction) {
        try {
            const response = await this._useCase.getCateogries();
            return res.status(StatusCode.OK).json({response});

        }catch(err) {
            next(err);
        }
    }

    async profile(req:Request ,  res: Response, next: NextFunction ){
        try {

            const decodedToken = req.app.locals.decodedToken;
            const response = await this._useCase.getUserDetails(decodedToken);
            return res.status(StatusCode.OK).json({response});

        }catch(err) {
            next(err);
        }
    }

    async updateUser(req:Request ,  res: Response, next: NextFunction ) {
        try{
            const {id , name  , mobile} = req.body;
            const response = await this._useCase.updateUserDetails(id , name  , mobile);
            return res.status(StatusCode.OK).json({response});

        }catch(err) {
           next(err);
        }
    }

    async getInstructorData(req:Request ,  res: Response, next: NextFunction) {
        try{
            const page = parseInt(req.query.page as string) || 1; 
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.searchTerm as string|| null 
            const category = req.query.category as string|| null

            const response = await this._useCase.getInstructorDetails(page , limit , search , category);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async resendInstructorOtp(req:Request , res:Response , next:NextFunction){
        try {
            const {token} = req.body;
    
            const response = await this._useCase.resendOtpByEmail(token);
            res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
       }

       async changePassword(req:Request , res:Response , next:NextFunction){
        try {
            const decodedToken = req.app.locals.decodedToken;
            const {current , confirm} = req.body;
            const response = await this._useCase.changeUserPassword(decodedToken , current , confirm);
            res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
       }

       async getInstructor(req:Request , res:Response , next:NextFunction) {
        try{
          
            const id = req.query.id as string;
            const decodedToken = req.app.locals.decodedToken;
            const response = await this._useCase.getInstructorDetail(id,decodedToken);
            
            return res.status(StatusCode.OK).json({response})
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

            const response = await  this._useCase.payement(info , token)
           
            return res.status(StatusCode.OK).json({ success: true, data: response });


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

          let session 
        switch (event?.type) {
            case "checkout.session.completed":
               session = event.data.object;
              
               const type = session.metadata?.type;

               if (type === "slot") {
                 await this._useCase.successPayment(session);
               } else if (type === "course") {
                 await this._useCase.successCoursePayment(session);
               }
               break;
             

        default:
        console.log(`Unhandled event type: ${event?.type}`);
      
       }
   
}

    async getSlots(req:Request , res:Response , next:NextFunction) {
        try{
            const decodedToken = req.app.locals.decodedToken;
           
            const response = await this._useCase.getSlotDetails(decodedToken);
            return res.status(StatusCode.OK).json({response});
        }catch(err){
            next(err);
        }
    }

    async setImg(req:Request , res:Response , next:NextFunction) {
        try{
            const token = req.app.locals.decodedToken;
            const {img} = req.body;
            
            const response = await this._useCase.updateUserImg(token , img);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getImg(req:Request , res:Response , next:NextFunction) {
        try {
            
            const decodedToken = req.app.locals.decodedToken;
            const response = await this._useCase.getUserImg(decodedToken);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async verifyRoom(req:Request , res:Response , next:NextFunction) {
        try {
            const roomId =  req.query.roomId as string;
            const userId = req.query.userId as string
            const response = await this._useCase.verifyRoomId(roomId , userId);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async rating(req:Request , res:Response , next:NextFunction) {
        try{
            const rating  = req.body.rating as number
            const id  = req.body.id as string;
            
            const response = await this._useCase.updateRating(rating , id);
            return res.status(StatusCode.OK).json({response});


        }catch(err) {
            next(err);
        }
    }

    async googleAuth(req:Request , res:Response , next:NextFunction) {
        try{
            const email  = req.body.email as string;
            const name  = req.body.name as string
            const img  = req.body.img as string
            const response = await this._useCase.googleCallback(email , name , img);
            
            
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async addReview(req:Request , res:Response , next:NextFunction) {
        try{
            const instructorId  = req.body.instructorId as string;
            const value  = req.body.value ;
            const decodedToken = req.app.locals.decodedToken;
            const response = await this._useCase.addInstructorReview(instructorId , value , decodedToken);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async refreshToken(req:Request , res:Response , next:NextFunction) {
        try{
            
            const refreshToken = req.cookies.refreshToken;
            const response = await this._useCase.verifyRefreshToken(refreshToken);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getRoomStatus(req:Request , res:Response , next:NextFunction) {
        try{
            
            const roomId =  req.query.roomId as string;
            const response = await this._useCase.roomStatus(roomId);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }
    async getTest(req:Request , res:Response , next:NextFunction) {
        try{
            
            const slotId =  req.query.slotId as string;
            const response = await this._useCase.getTestData(slotId);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getQuestion(req:Request , res:Response , next:NextFunction) {
        try{
            
            const qId =  req.query.qId as string;
            const response = await this._useCase.getQuestionData(qId);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async updateResult(req:Request , res:Response , next:NextFunction) {
        try{
            
            const {slotId , score} =  req.body
            const response = await this._useCase.updateResultData(slotId,score);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getCourse(req:Request , res:Response , next:NextFunction) {
        try{
            
            const courseId =  req.query.courseId as string;
            const token =  req.app.locals.decodedToken;
            const response = await this._useCase.getCourseDetails(courseId , token.id);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }


    async coursePayment(req:Request , res:Response , next:NextFunction) {
        try{
            const {details} = req.body;
            const token =  req.app.locals.decodedToken;
            const {id , name , startDate , endDate , instructorId , price} = details
            const info = {
                id , 
                name , 
                startDate ,
                endDate ,
                instructorId ,
                price
            }
            const response = await  this._useCase.coursePayement(info , token.id)
           
            return res.status(StatusCode.OK).json({ success: true, data: response });


        }catch (err) {
            next(err);
        }
       }

       async studentCourse(req:Request , res:Response , next:NextFunction) {
        try{
            
            const token =  req.app.locals.decodedToken;
            const response = await this._useCase.getEnrolledCourses(token.id);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getNotification(req:Request , res:Response , next:NextFunction) {
        try{
            
            const token =  req.app.locals.decodedToken;
            const response = await this._useCase.userNotification(token.id);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async deleteNotifications(req:Request , res:Response , next:NextFunction) {
        try{
            
            const token =  req.app.locals.decodedToken;
            const response = await this._useCase.clearAllNotification(token.id);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getBannerData(req:Request , res:Response , next:NextFunction) {
        try{
            
            const response = await this._useCase.bannerRatingData();
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getLatestCourse(req:Request , res:Response , next:NextFunction) {
        try{
            
            const response = await this._useCase.latestCourseData();
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getPopularInstrcutors(req:Request , res:Response , next:NextFunction) {
        try{
            
            const response = await this._useCase.popularInstructorData();
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async getSearchCourse(req:Request , res:Response , next:NextFunction) {
        try{
           
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            const search: string | null = (req.query.searchTerm as string) || null;
            const category: string | null = (req.query.selectedCategory as string) || null;
            const minPrice: number | null = req.query.minPrice ? Number(req.query.minPrice) : null;
            const maxPrice: number | null = req.query.maxPrice ? Number(req.query.maxPrice) : null;

            const response = await this._useCase.searchCourseData(page,limit,search,category,minPrice,maxPrice);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async raiseCourseTicket(req:Request , res:Response , next:NextFunction) {
        try{
            const token =  req.app.locals.decodedToken;
            const {thumbnail , description ,courseId, instructorId} = req.body
            const response = await this._useCase.reportCourseIssue(thumbnail , description ,courseId, instructorId , token.id);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async createQnA(req:Request , res:Response , next:NextFunction) {
        try{
            const token =  req.app.locals.decodedToken;
            const {message , parentId,courseId} = req.body
            const response = await this._useCase.createQnaData(message , parentId,courseId, token.id);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async fetchQnAData(req:Request , res:Response , next:NextFunction) {
        try{
            const courseId =  req.query.courseId as string;
            const response = await this._useCase.getAllQnADatas(courseId);
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async fetchAnnoucementData(req:Request , res:Response , next:NextFunction) {
        try{
           
            const response = await this._useCase.getAllAnnouncementDatas();
            return res.status(StatusCode.OK).json({response});

        }catch(err){
            next(err)
        }
    }

    async forgotPassword(req:Request , res:Response , next:NextFunction) {
        try{
            const email = req.query.email as string
            const response = await this._useCase.sendForgotPasswordOTP(email);
            if(response.success === true) {
                return res.status(StatusCode.OK).json({ success: true ,token:response.token});
            }else{
                return res.status(StatusCode.OK).json({success:false , message:response.message})
            }

        }catch(err){
            next(err)
        }
    }

    async passwordOtp(req:Request , res:Response , next:NextFunction) {
        try{
            const otp = req.query.userOtp as string
            const token = req.query.token as string;
            const response = await this._useCase.verifyPasswordOtp(otp , token);
            return res.status(StatusCode.OK).json({response});
        }catch(err){
            next(err)
        }
    }

    async resetPassword(req:Request , res:Response , next:NextFunction){
        try {
            
            const {current , confirm , token} = req.body;
            const response = await this._useCase.changeUser_Password(token , confirm);
            if(response?.success){
                const REFRESH_MAXAGE = parseInt(process.env.REFRESH_MAXAGE!);
                res.cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    domain: ".levelup.icu",
                    maxAge: REFRESH_MAXAGE
                  });
            }
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
       }
}

