import { Request, Response, NextFunction } from "express";
import instructorUseCase from "../../usecase/instructorUseCase";


class instructorController {
    constructor(private useCase:instructorUseCase){}

    async createInstructor(req:Request , res:Response , next:NextFunction) {
        try {
            const instructor = req.body;

            const response = await this.useCase.findInsrtuctor(instructor);
           
            return res.status(200).json({response});
            
        } catch(err) {
            next(err);
        }

    } 

    async verifyInstructorOtp(req:Request , res:Response , next:NextFunction) {
        try{

            const {instructorOtp , token} = req.body;

            const response = await this.useCase.saveInstructor(instructorOtp , token);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: true, // Use only in HTTPS
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
            
            return res.status(200).json({response})
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
            
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

   async getCatList(req:Request , res:Response , next:NextFunction)  {
    try{
        const response = await this.useCase.getCataData();
        return res.status(200).json({response});

    }catch(err) {
        next(err);
    }
   }

   async updateInstructor(req:Request , res:Response , next:NextFunction) {
    try {
        const {description , experienceCategory ,experienceCertificate , resume} = req.body;
        const token = req.cookies;
       
        const response = await this.useCase.updateInstructor(token.authToken , description , experienceCategory ,experienceCertificate , resume);
        
        res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }
 
   async getInstructorById(req:Request , res:Response , next:NextFunction){
    try {
        const token = req.cookies;
        const response = await this.useCase.getInstructorDetails(token.authToken);
        res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }

   async editInstructorById(req:Request , res:Response , next:NextFunction){
    try {
        const {name , mobile} = req.body;
        const token = req.cookies;
        const response = await this.useCase.editInstructorDetails(token.authToken , name , mobile);
        res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }
   async updateProfileImg(req:Request , res:Response , next:NextFunction){
    try {
        const {img} = req.body;
        const token = req.cookies;
        const response = await this.useCase.updateImg(token.authToken,img);
        res.status(200).json({response});
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

   async changePassword(req:Request , res:Response , next:NextFunction) {
     try{
        const token = req.cookies.authToken;
        const {current , confirm}  = req.body;

        const response = await this.useCase.changeInstructorPassword(token , current , confirm);
        res.status(200).json({response});

     }catch(err) {
        next(err)
     }
   }

   async scheduleSession(req:Request , res:Response , next:NextFunction) {
    try{
        const events = req.body.event;
        const token = req.cookies.authToken;
        const {title , start , end , price} = events;
        const response = await this.useCase.scheduleSessionById(title , start , end , price , token);
        return res.status(200).json({response});


    }catch(err) {
        next(err);
    }
   }

   async getEvents(req:Request , res:Response , next:NextFunction) {
    try{
        
        const token = req.cookies.authToken;
        const response = await this.useCase.getEventsData(token);
        return res.status(200).json({response})

    }catch(err) {
        next(err);
    }
   }

   async deleteEvent(req:Request , res:Response , next:NextFunction) {
    try{
        const id = req.body.id as string;
        const token = req.cookies.authToken;
        const response = await this.useCase.deleteEventData(id , token);
        return res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }

   async getSlot(req:Request , res:Response , next:NextFunction){
    try{
        const token = req.cookies.authToken;
        const response = await this.useCase.getSlots(token)
        return res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }

   async getWallet(req:Request , res:Response , next:NextFunction){
    try{
        const token =  req.query.token as string;
        const response = await this.useCase.getWalletDetails(token)
        return res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }

   async getImg(req:Request , res:Response , next:NextFunction) {
    try{
        const token =  req.cookies.authToken;
        const response = await this.useCase.getInstructorImg(token);
        return res.status(200).json({response});
    }catch(err) {
        next(err);
    }
   }

   async verifyRoom(req:Request , res:Response , next:NextFunction) {
    try{
        const roomId =  req.query.roomId as string;
        const userId = req.query.instructorId as string
        const response = await this.useCase.verifyroomId(roomId , userId);
        return res.status(200).json({response});
    }catch(err) {
        next(err)
    }
   }
}


export default instructorController;