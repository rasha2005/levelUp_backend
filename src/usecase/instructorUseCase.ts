import { inject, injectable } from "inversify";
import Instructor from "../entity/Instructor";
import DecodedToken from "../entity/Token";
import IinstructorRepository from "../interface/repository/IinstructorRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";
import { InstructorDTO } from "./dtos/InstructorDTO";

@injectable()
export class InstructorUseCase {
    constructor(
       @inject("IinstructorRepository") private _instructorRespository:IinstructorRepository,
       @inject("IgenerateOtp") private _generateOtp: IgenerateOtp,
       @inject("IsendEmailOtp") private _sendEmailOtp: IsendEmailOtp,
       @inject("Ijwt") private _jwt: Ijwt,
       @inject("IhashPassword") private _hashPassword: IhashPassword,
    ){}

    async findInsrtuctor(instructor:Instructor) {
      
            try {
        const {email} = instructor

        const res = await this._instructorRespository.findByEmail(email);
       
        if(res) {
            return {status:200 , success:false , message:"user found" };
        }else{
            const otp = this._generateOtp.createOtp();
            
            await this._sendEmailOtp.sendEmail(email , otp);
            const instructorOtp = await this._instructorRespository.saveOtp(email , otp);
            
            const token = this._jwt.otpToken(instructor);
            
            return {status:200 , success:true , instructorOtp , token };
        }
    }catch(err:any) {
        throw(err)
    }
    
    }

    async saveInstructor(instructorOtp:string , token:string) {
        try{
       
         const decodedToken = this._jwt.verifyToken(token);
        
        const otp = await this._instructorRespository.findOtpByEmail(decodedToken?.info.email);
        
        const hashedPassword = await this._hashPassword.hash(decodedToken?.info.password);
        
       
        if(otp?.otp == instructorOtp) {
            
            const instructor = await this._instructorRespository.insertInstructor(decodedToken?.info , hashedPassword);
            if(instructor) {
                const authToken = this._jwt.authToken(instructor.id , instructor.email , "Instructor");
                const refreshToken = this._jwt.refreshToken(instructor.id , instructor.email , "Instructor");

               
                return {success:true , message:"user saved successfully" ,authToken:authToken , refreshToken};
            }
        }
        return {success:false , message:"Invalid Otp"};
    }catch(err:any) {
        throw(err)
    }

    }

    async verifyLogin(email:string , instructorpassword:string) {
      try{
         const instructor = await this._instructorRespository.findByEmail(email);
        if(instructor) {
            const password = await this._hashPassword.compare(instructorpassword , instructor.password);
            const token = this._jwt.authToken( instructor.id , instructor.email , "Instructor")
            const refreshToken = this._jwt.refreshToken( instructor.id , instructor.email , "Instructor")
            if(password) {
                
                return {success:true , message:"user matched succesfully" , authToken:token , refreshToken};

            }else{
                return {success:false , message:"Invalid password"};
            }

        }else{
            return {success:false , message:"Invalid Email"};
        }
      }catch(err:any) {
        throw(err)
      }
    }

    async getCataData() {
        try{
        const res = await this._instructorRespository.getCategoryList();
       
        if(res) {
            return {success:true , message:"category fetched successfully" , res}
        }else{
            return {success:false , message:"category not found"};
        }
    }catch(err:any) {
        throw(err)
    }
    }

    async updateInstructor(token:DecodedToken ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string) {
        try{
        
        if(token){
            const res = await this._instructorRespository.updateInstructorDetials(token.email ,description , experienceCategory ,experienceCertificate , resume);
            if(res) {
                return {success:true , message:"updated successfully" , res}
            }else{
                return {success:false , message:"something went wrong"};
            }
        }
    }catch(err:any){
        throw(err)
    }
    }

    async getInstructorDetails(token:DecodedToken) {
        try{
        

            if(token){
                const res = await this._instructorRespository.getInstructorByEmail(token.email );
                if(res) {
                    const instructorDto = InstructorDTO.fromEntity(res)
                    return {success:true , message:"updated successfully" , res:instructorDto}
                }else{
                    return {success:false , message:"something went wrong"};
                }
            }
        }catch(err:any){
            throw(err)
        }
    }

    async editInstructorDetails(token:DecodedToken , name:string , mobile:string) {
        try{

        if(token){
            const res = await this._instructorRespository.editInstructorByEmail(token.email ,name , mobile);
            if(res) {
                const instructorDto = InstructorDTO.fromEntity(res)
                return {success:true , message:"updated successfully" , res:instructorDto}
            }else{
                return {success:false , message:"something went wrong"};
            }

    }
}catch(err:any){
        throw(err)
    }
}

    async updateImg(token:DecodedToken , img:string ) {
        try{

        if(token){
            const res = await this._instructorRespository.updateProfileByEmail(token.email ,img);
            if(res) {
                const instructorDto = InstructorDTO.fromEntity(res)
                return {success:true , message:"updated successfully" , res:instructorDto}
            }else{
                return {success:false , message:"something went wrong"};
            }

    }
        }catch(err:any){
            throw(err);
        }
}

async resendOtpByEmail(token:string) {
    try{
    const decodedToken = this._jwt.verifyToken(token);
   
    if(decodedToken) {
        const otp = this._generateOtp.createOtp();
        
        await this._sendEmailOtp.sendEmail(decodedToken.info.email , otp);
        const otpData = await this._instructorRespository.findOtpByEmail(decodedToken.info.email);
        if(otpData) {
            const updatedOtp = await this._instructorRespository.updateOtpByEmail(decodedToken.info.email , otp);
            
            return {success:true , message:"otp resend successfully" , updatedOtp};
        }else{
            const savedOtp = await this._instructorRespository.saveOtp(decodedToken.info , otp);
            
            return {success:true , message:"otp resend successfully" , savedOtp};
        }
       
    }
    return {success:false , message:"something went wrong"};
        }catch(err:any){
            throw(err)
        }
}


  async changeInstructorPassword(token:DecodedToken , current:string , confirm:string) {
    try{
    
    if(token) {
        const instructor = await this._instructorRespository.findByEmail(token.email);
        if(instructor) {
            const isPasswordMatched = await this._hashPassword.compare(current , instructor.password);
            if(isPasswordMatched) {
                const hashedPassword = await this._hashPassword.hash(confirm);
                const updatedInstructor = await this._instructorRespository.changePassword(token.email , hashedPassword); 
                if(updatedInstructor) {
                    const instructorDto = InstructorDTO.fromEntity(updatedInstructor)
                    return {success:true , message:'password updated successfully' , updatedInstructor:instructorDto};
                }else{
                    return{success:false , message:'something went wrong'}
                }
            }else{
                return {success:false , message:'Incorrect password'}
            }
        }else{
            return {success:false , message:"something went wrong"};
        }
    }
    }catch(err:any){
        throw(err)
    }
}

    async scheduleSessionById(title:string , start:string , end:string , price: string , token:DecodedToken) {
        try{
   
    
    if(token) {
        const session = await this._instructorRespository.scheduleSession(token.id , title , start , end , price);
        
        if(session) {
            return {success:true , message:"session scheduled successfully" , session};
        }else{
            return {success:false , message:"something went wrong"};
        }
    }else{
        return {success:true , message:"something went wrong"};
    }
    }catch(err:any){
        throw(err)
    }
    
}

    async getEventsData(token:DecodedToken) {
        try{
        
        const instructor = await this._instructorRespository.getInstructorByEmail(token?.email)
        const instructorDto = InstructorDTO.fromEntity(instructor!)
        if(token) {
            const events = await this._instructorRespository.getEventsById(token.id);
            return {success:true , message:"events retrived successfully" , events , instructor:instructorDto };
        }else{
            return {success:false , message:"something went wrong"};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async deleteEventData(id:string , token:DecodedToken) {
        try{
        if(token) {
            const isDeleted = await this._instructorRespository.deleteEventById(id , token.id);
            if(isDeleted) {
                return {success:true , message:'event deleted successfully'};
            }else{
                return {success:false , message:"something went wrong"}
            }
        }else{
            return {success:false , message:"something went wrong"}
        }
    }catch(err:any){
        throw(err)
    }
    }
    async getSlots(token:DecodedToken) {
        try{
        const slot = await this._instructorRespository.getSlotList(token?.id);
        
        if(slot) {
         return {success:true , message:"events retrived successfully" , slot};
        }else{
         return {success:false , message:"something went wrong"};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async getWalletDetails(token:DecodedToken) {
        try{
        
        

        const Wallet = await this._instructorRespository.findWallet(token?.id);
        const slot = await this._instructorRespository.getSlotList(token?.id);
        
        
        if(slot) {
            return {success:true , message:"slots found successfully" , slot , Wallet}
        }else{
            return {success:false , message:"not found"}
        }
    }catch(err:any){
        throw(err)
    }
        
    }

    async getInstructorImg(token:DecodedToken) {
        try{
        const image = await this._instructorRespository.getImgById(token?.id);
        if(image) {
            return {success:true , message:"image fetched successfully" , image};
        }else{
            return {success:false , message:"something went wrong"}
        }
    }catch(err:any){
        throw(err)
    }
    }

    async verifyroomId(roomId:string , instructorId:string) {
        try{
        const slot = await this._instructorRespository.verifyRoomById(roomId);
        if(slot?.instructorId == instructorId) {
            return {success:true}
        }else{
            return {success:false}
        }
    }catch(err:any){
        throw(err)
    }
    }

}

