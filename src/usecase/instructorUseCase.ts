import Instructor from "../entity/Instructor";
import IinstructorRepository from "../interface/repository/IinstructorRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";

class instructorUseCase {
    constructor(
        private _instructorRespository:IinstructorRepository,
        private _generateOtp:IgenerateOtp,
        private _sendEmailOtp:IsendEmailOtp,
        private _jwt:Ijwt,
        private _hashPassword:IhashPassword
    ){}

    async findInsrtuctor(instructor:Instructor) {
      
            
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
    
    }

    async saveInstructor(instructorOtp:string , token:string) {
       
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
   

    }

    async verifyLogin(email:string , instructorpassword:string) {
      
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
    
    }

    async getCataData() {
        const res = await this._instructorRespository.getCategoryList();
       
        if(res) {
            return {success:true , message:"category fetched successfully" , res}
        }else{
            return {success:false , message:"category not found"};
        }
    }

    async updateInstructor(token:string ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string) {
        const decodedToken = this._jwt.verifyToken(token);
        if(decodedToken){
            const res = await this._instructorRespository.updateInstructorDetials(decodedToken.email ,description , experienceCategory ,experienceCertificate , resume);
            if(res) {
                return {success:true , message:"updated successfully" , res}
            }else{
                return {success:false , message:"something went wrong"};
            }
        }
    }

    async getInstructorDetails(token:string) {
        const decodedToken = this._jwt.verifyToken(token);

            if(decodedToken){
                
                const res = await this._instructorRespository.getInstructorByEmail(decodedToken.email );
                if(res) {
                    return {success:true , message:"updated successfully" , res}
                }else{
                    return {success:false , message:"something went wrong"};
                }
            }
    }

    async editInstructorDetails(token:string , name:string , mobile:string) {
        const decodedToken = this._jwt.verifyToken(token);

        if(decodedToken){
            const res = await this._instructorRespository.editInstructorByEmail(decodedToken.email ,name , mobile);
            if(res) {
                return {success:true , message:"updated successfully" , res}
            }else{
                return {success:false , message:"something went wrong"};
            }

    }
}

    async updateImg(token:string , img:string ) {
        const decodedToken = this._jwt.verifyToken(token);


        if(decodedToken){
            const res = await this._instructorRespository.updateProfileByEmail(decodedToken.email ,img);
            if(res) {
                return {success:true , message:"updated successfully" , res}
            }else{
                return {success:false , message:"something went wrong"};
            }

    }
}

async resendOtpByEmail(token:string) {
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
}


  async changeInstructorPassword(token:string , current:string , confirm:string) {
    const decodedToken = this._jwt.verifyToken(token);
    if(decodedToken) {
        const instructor = await this._instructorRespository.findByEmail(decodedToken.email);
        if(instructor) {
            const isPasswordMatched = await this._hashPassword.compare(current , instructor.password);
            if(isPasswordMatched) {
                const hashedPassword = await this._hashPassword.hash(confirm);
                const updatedInstructor = await this._instructorRespository.changePassword(decodedToken.email , hashedPassword); 
                if(updatedInstructor) {
                    return {success:true , message:'password updated successfully' , updatedInstructor};
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
}

    async scheduleSessionById(title:string , start:string , end:string , price: string , token:string) {
    const decodedToken = this._jwt.verifyToken(token);
    
    if(decodedToken) {
        const session = await this._instructorRespository.scheduleSession(decodedToken.id , title , start , end , price);
        
        if(session) {
            return {success:true , message:"session scheduled successfully" , session};
        }else{
            return {success:false , message:"something went wrong"};
        }
    }else{
        return {success:true , message:"something went wrong"};
    }
    
}

    async getEventsData(token:string) {
        const decodedToken = this._jwt.verifyToken(token);
        const instructor = await this._instructorRespository.getInstructorByEmail(decodedToken?.email)
        if(decodedToken) {
            const events = await this._instructorRespository.getEventsById(decodedToken.id);
            return {success:true , message:"events retrived successfully" , events , instructor };
        }else{
            return {success:false , message:"something went wrong"};
        }
    }

    async deleteEventData(id:any , token:string) {
        const decodedToken = this._jwt.verifyToken(token);
        if(decodedToken) {
            const isDeleted = await this._instructorRespository.deleteEventById(id , decodedToken.id);
            if(isDeleted) {
                return {success:true , message:'event deleted successfully'};
            }else{
                return {success:false , message:"something went wrong"}
            }
        }else{
            return {success:false , message:"something went wrong"}
        }
    }
    async getSlots(id:any) {
        const decodedToken = this._jwt.verifyToken(id);
        const slot = await this._instructorRespository.getSlotList(decodedToken?.id);
        
        if(slot) {
         return {success:true , message:"events retrived successfully" , slot};
        }else{
         return {success:false , message:"something went wrong"};
        }
    }

    async getWalletDetails(token:any) {
        const decodedToken = this._jwt.verifyToken(token);
        

        const Wallet = await this._instructorRespository.findWallet(decodedToken?.id);
        const slot = await this._instructorRespository.getSlotList(decodedToken?.id);
        
        if(slot) {
            return {success:true , message:"slots found successfully" , slot , Wallet}
        }else{
            return {success:false , message:"not found"}
        }
        
    }

    async getInstructorImg(token:any) {
        const decodedToken = this._jwt.verifyToken(token);
        

        const image = await this._instructorRespository.getImgById(decodedToken?.id);
        if(image) {
            return {success:true , message:"image fetched successfully" , image};
        }else{
            return {success:false , message:"something went wrong"}
        }
    }

    async verifyroomId(roomId:any , instructorId:any) {
        const slot = await this._instructorRespository.verifyRoomById(roomId);
        if(slot?.instructorId == instructorId) {
            return {success:true}
        }else{
            return {success:false}
        }
    }

}

export default instructorUseCase;