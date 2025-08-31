import { Request, Response, NextFunction } from "express";
import {InstructorUseCase} from "../../usecase/instructorUseCase";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../enums/statuscode";

@injectable()
export class InstructorController {
    constructor(@inject("InstructorUseCase") private useCase:InstructorUseCase){}

    async createInstructor(req:Request , res:Response , next:NextFunction) {
        try {
            const instructor = req.body;

            const response = await this.useCase.findInstructor(instructor);
           
            return res.status(StatusCode.OK).json({response});
            
        } catch(err) {
            next(err);
        }

    } 

    async verifyInstructorOtp(req:Request , res:Response , next:NextFunction) {
        try{

            const {instructorOtp , token} = req.body;

            const response = await this.useCase.saveInstructor(instructorOtp , token);
            const REFRESH_MAXAGE = parseInt(process.env.REFRESH_MAXAGE!);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: true, 
                sameSite: "strict",
                maxAge: REFRESH_MAXAGE
              });
            
            return res.status(StatusCode.OK).json({response})
        }catch(err){
            next(err);
        }
    }

    async verifyLogin(req:Request , res:Response , next:NextFunction) {
        try{
            const {email , password} = req.body;
            const response = await this.useCase.verifyLogin(email , password);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: true, // Use only in HTTPS
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
            
            return res.status(StatusCode.OK).json({response});

        }catch(err) {
            next(err);
        }
    }

   async getCatList(req:Request , res:Response , next:NextFunction)  {
    try{
        const response = await this.useCase.getCataData();
        return res.status(StatusCode.OK).json({response});

    }catch(err) {
        next(err);
    }
   }

   async updateInstructor(req:Request , res:Response , next:NextFunction) {
    try {
        const {description , experienceCategory ,experienceCertificate , resume} = req.body;
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.updateInstructor(token.authToken , description , experienceCategory ,experienceCertificate , resume);
        
        res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }
 
   async getInstructorById(req:Request , res:Response , next:NextFunction){
    try {
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.getInstructorDetails(token);
        res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async editInstructorById(req:Request , res:Response , next:NextFunction){
    try {
        const {name , mobile} = req.body;
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.editInstructorDetails(token , name , mobile);
        res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }
   async updateProfileImg(req:Request , res:Response , next:NextFunction){
    try {
        const {img} = req.body;
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.updateImg(token,img);
        res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async resendInstructorOtp(req:Request , res:Response , next:NextFunction){
    try {
        const {token} = req.body;

        const response = await this.useCase.resendOtpByEmail(token);
        res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async changePassword(req:Request , res:Response , next:NextFunction) {
     try{
        const token = req.app.locals.decodedToken;
        const {current , confirm}  = req.body;

        const response = await this.useCase.changeInstructorPassword(token , current , confirm);
        res.status(StatusCode.OK).json({response});

     }catch(err) {
        next(err)
     }
   }

   async scheduleSession(req:Request , res:Response , next:NextFunction) {
    try{
        const events = req.body.event;
        const token =req.app.locals.decodedToken;
        const {title , start , end , price} = events;
        const response = await this.useCase.scheduleSessionById(title , start , end , price , token);
        return res.status(StatusCode.OK).json({response});


    }catch(err) {
        next(err);
    }
   }

   async getEvents(req:Request , res:Response , next:NextFunction) {
    try{
        
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.getEventsData(token);
        return res.status(StatusCode.OK).json({response})

    }catch(err) {
        next(err);
    }
   }

   async deleteEvent(req:Request , res:Response , next:NextFunction) {
    try{
        const id = req.body.id as string;
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.deleteEventData(id , token);
        return res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async getSlot(req:Request , res:Response , next:NextFunction){
    try{
        const token = req.app.locals.decodedToken;
        const response = await this.useCase.getSlots(token)
        return res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async getWallet(req:Request , res:Response , next:NextFunction){
    try{
        const token =  req.app.locals.decodedToken;
        const response = await this.useCase.getWalletDetails(token)
        return res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async getImg(req:Request , res:Response , next:NextFunction) {
    try{
        const token =  req.app.locals.decodedToken;
        const response = await this.useCase.getInstructorImg(token);
        return res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err);
    }
   }

   async verifyRoom(req:Request , res:Response , next:NextFunction) {
    try{
        const roomId =  req.query.roomId as string;
        const userId = req.query.instructorId as string
        const response = await this.useCase.verifyroomId(roomId , userId);
        return res.status(StatusCode.OK).json({response});
    }catch(err) {
        next(err)
    }
   }
}
