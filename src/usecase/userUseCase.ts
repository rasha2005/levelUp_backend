import { injectable, inject } from "inversify";
import PaymentInfo from "../entity/Info";
import DecodedToken from "../entity/Token";
import User from "../entity/User";
import IuserRepository from "../interface/repository/IuserRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";
import Istripe from "../interface/services/Istripe";
import { InstructorDTO } from "./dtos/InstructorDTO";
import { UserDTO } from "./dtos/UserDTO";

@injectable()
export class UserUseCase {
    constructor(
        @inject("IuserRepository") private _iuserRepository: IuserRepository,
        @inject("IgenerateOtp") private _generateOtp: IgenerateOtp,
        @inject("IsendEmailOtp") private _sendEmailOtp: IsendEmailOtp,
        @inject("Ijwt") private _jwtToken: Ijwt,
        @inject("IhashPassword") private _hashPassword: IhashPassword,
        @inject("Istripe") private _stripe: Istripe
    ){}

   async findUser(user:User) {
    try{
       
       const res = await this._iuserRepository.findByEmail(user.email);

       
       if (res) {
       
        return {status:200, success:false, message: 'User found' }; 
        }else{
            const otp = this._generateOtp.createOtp();
            
         await this._sendEmailOtp.sendEmail(user.email , otp);
         const userOtp = await this._iuserRepository.saveOtp(user.email , otp);
         const token =  this._jwtToken.otpToken(user);

         return {status:200 , success:true , userOtp , token };
        }
    }catch(err:any) {
        throw(err)
    }
   
   }

   async saveUser(userOtp:string , token:string) {
    try{

    
        
    const decodedToken = this._jwtToken.verifyToken(token);
    
    
    const otp = await this._iuserRepository.findOtp(decodedToken?.info.email);
    
    const password = decodedToken?.info.password;
    const hashedPassword =  await this._hashPassword.hash(password)
    
    if(userOtp == otp?.otp){
        const res =  await this._iuserRepository.insertUser(decodedToken?.info , hashedPassword);
        
        const authToken = this._jwtToken.authToken( res.user.id ,res.user.email, "User");
        const refreshToken = this._jwtToken.refreshToken(res.user.id ,res.user.email, "User");
        if(res) {
            return {success:true , message:"user saved successfully" , authToken:authToken ,refreshToken };
        }
    }
    return {success : false , message:"Invalid otp"}
}catch(err:any){
    throw(err);
}
    
   }


   async verifyLogin(email:string , userPassword:string) {

    try{
        const user = await this._iuserRepository.findByEmail(email);
     if(user?.isBlocked) {
        return {success:false , message:"you have been blocked"};
     }
     if(user && user.password) {
        const password =  await this._hashPassword.compare(userPassword , user.password);
        const token = this._jwtToken.authToken(user.id,user.email ,"User")
        const refreshToken = this._jwtToken.refreshToken(user.id,user.email ,"User")
        
      
        if(password) {
            return {success:true , message:"user matched succesfully" ,authToken:token , refreshToken};
        }else{
            return {success:false , message:"Invadil password"};
        }
     }else{
        return {sucess:false , message:"Invalid email"}; 
     }

    }catch(err:any) {
        throw(err)
    }

   }

   async getCateogries() {
   try{   
        const category = await this._iuserRepository.getCategoryData();
   if(category) {
    return {success:true  ,category};
   }else{
    return {sucess:false , message:"something went wrong"}; 
   }
}catch(err:any){
    throw(err)
}
  
   }

   async getUserDetails(token:DecodedToken) {
    try{
    const user = await this._iuserRepository.findById(token?.id);
    if(user){
        const userDTO = UserDTO.fromEntity(user);
        return {success:true , message:"user matched succesfully" ,user:userDTO};
    }else{
        return {success:false , message:"no user found"};
    }
    }catch(err:any){
        throw(err)
    }
   }

   async updateUserDetails(id:string ,name:string , mobile:string) {
    try{
    const user = await this._iuserRepository.editUserDetails(id , name  , mobile);
    if(user) {
        const userDTO = UserDTO.fromEntity(user);
        return {success:true , message:"user updated succesfully" ,user:userDTO};
    }else{
        return {success:false , message:"no user found"};
    }
    }catch(err:any){
        throw(err);
    }
   }

   async getInstructorDetails(page:number , limit:number , search:string | null , category :string | null) {
    try{  
    const {instructor , total} = await this._iuserRepository.getInstructor(page , limit , search , category);
    const instructorDto = instructor?.map(inst => new InstructorDTO(inst)) || [];
    return {success:true , message:"instructors found" , instructor:instructorDto , total};
    }catch(err:any){
        throw(err)
    }
   }

   async resendOtpByEmail(token:string) {
    try{
    const decodedToken = this._jwtToken.verifyToken(token);
   
    if(decodedToken) {
        const otp = this._generateOtp.createOtp();
       
        await this._sendEmailOtp.sendEmail(decodedToken.info.email , otp);
        const otpData = await this._iuserRepository.findOtp(decodedToken.info.email);
        if(otpData) {
            const updatedOtp = await this._iuserRepository.updateOtpByEmail(decodedToken.info.email , otp);
            
            return {success:true , message:"otp resend successfully" , updatedOtp};
        }else{
            const savedOtp = await this._iuserRepository.saveOtp(decodedToken.info , otp);
           
            return {success:true , message:"otp resend successfully" , savedOtp};
        }
       
    }
    return {success:false , message:"something went wrong"};
    }catch(err:any){
        throw(err)
    }
}

    async changeUserPassword(token:DecodedToken , current:string , confirm:string) {
        try{
        
        if(token) {
            const user = await this._iuserRepository.findByEmail(token.email);
            if(user && user.password) {
                const isPasswordMatched = await this._hashPassword.compare(current , user?.password)
                if(isPasswordMatched) {
                    const hashedPassword = await this._hashPassword.hash(confirm);
                    const updatedUser = await this._iuserRepository.changePassword(user.email ,hashedPassword);
                    if(updatedUser) {
                        const userDTO = UserDTO.fromEntity(user);
                        return {success:true , message:'password updated successfully' , updatedUser:userDTO};
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

    async getInstructorDetail(id:string, token:DecodedToken) {
        try{
       
        const instructor = await this._iuserRepository.getInstructorId(id);
        if(instructor) {
            const review = await this._iuserRepository.getReviewById(id)
            const isReview = await this._iuserRepository.reviewExist(id , token?.id)
            const instructorDto = InstructorDTO.fromEntity(instructor)
            return {success:true , message:"instructor found successfully" , instructor:instructorDto  , review , isReview , } ;
        }else{
            return {success:false , message:"instructor not found"};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async payement(info:PaymentInfo ,token:string) {
        try{
      
        const decodedToken = this._jwtToken.verifyToken(token);

        const res = await this._stripe.stripePayement(info ,decodedToken?.id);
        if(res) {
            return res
        }else{
        }
        }catch(err:any){
            throw(err)
        }
    }

    async successPayment(session:any) {
        try{
    
        const {instructorId , userId , id , price} = session.metadata;
        const slot = await this._iuserRepository.createSlot(session.metadata);
        const updatedStatus = await this._iuserRepository.updateEventStatus(id);
        const priceNumber = parseFloat(price);
        const percent = price * 0.15
        const amount =  priceNumber - (price * 0.15)
        const type = "credit"
        const wallet = await this._iuserRepository.createInstructorWallet(instructorId , amount , type ,percent);
        }catch(err:any){
            throw(err)
        }
        
    }

    async getSlotDetails(token:DecodedToken) {
        try{
        
        const slot = await this._iuserRepository.findSlots(token?.id);
        if(slot) {
            return {success:true , message:"slots found successfully" , slot}
        }else{
            return {success:false , message:"not found"}
        }
    }catch(err:any){
        throw(err)
    }
    }

    async updateUserImg(token:DecodedToken , img:string) {
        try{
        const image = await this._iuserRepository.updateImg(token?.id , img);
        
        if(image) {
            return {success:true , message:"image update successfully" , image};
        }else{
            return {success:false , message:"something went wrong"}
        }
    }catch(err:any){
        throw(err)
    }
    }

    async getUserImg(token:DecodedToken ) {
        try{
            if(token){
        const image = await this._iuserRepository.getImgById(token?.id);
        if(image) {
            return {success:true , message:"image fetched successfully" , image};
        }else{
            return {success:false , message:"something went wrong"}
        }
    }
    }catch(err:any){
        throw(err)
    }
    } 

    async verifyRoomId(roomId:string , userId:string) {
        try{
        const data = await this._iuserRepository.verifyRoomById(roomId);
        if(data) {
            if(data.userId == userId) {
                return {success:true };
            }else{
                return {success:false}
            }
        }
        return {success:false}
    }catch(err:any){
        throw(err)
    }
    }

    async updateRating(rating:number , slotId:string) {
        const data = await this._iuserRepository.updateSlotById(rating , slotId);
        if(data) {
            return {success:true };
        }else{
            return {success:false}
        }
        
    }
   
    async googleCallback(email:string , name:string , img:string) {
        try{
        const user = await this._iuserRepository.createUserByGoogle(email , name , img);
        
        if(user) {
            const token = await this._jwtToken.authToken(user.id , user.email , "User");
            if(token) {
                return {success:true , message:"authentication successfull" , user , authToken:token};
            }else{
                return {succes:false , message:"something went wrong"};
            }
        }
        return {success:false , message:"something went wrong"};
    }catch(err:any){
        throw(err)
    }
    }

    async addInstructorReview(instructorId:string , value:string , token:DecodedToken){
        try{
        
        if(token) {
            const res = await this._iuserRepository.addReview(instructorId , value , token.id);
            if(res) {
                return {success:true , message:"review added successfully"};
            }else{
                return {success:false , message:"something went wrong"}
            }
        }
    }catch(err:any){
        throw(err)
    }
    }

    async verifyRefreshToken(refreshToken:string){
        try{
        const verifiedToken = this._jwtToken.verifyToken(refreshToken);
        
            if(verifiedToken) {
                const authToken = this._jwtToken.authToken(verifiedToken.id , verifiedToken.email , verifiedToken.role);
                if(authToken) {
                    return {success:true , authToken};
                }else{
                    return {success:false}
                }
            }else{
                return {success:false}
            }
        }catch(err:any){
            throw(err)
        }
        
    }

}
