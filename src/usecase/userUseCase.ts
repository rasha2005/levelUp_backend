import User from "../entity/User";
import IuserRepository from "../interface/repository/IuserRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";
import Istripe from "../interface/services/Istripe";

class userUseCase {
    constructor (
        private _iuserRepository: IuserRepository,
        private _generateOtp: IgenerateOtp,
        private _sendEmailOtp: IsendEmailOtp,
        private _jwtToken : Ijwt,
        private _hashPassword : IhashPassword,
        private _stripe : Istripe
    ){}

   async findUser(user:User) {
       
        console.log("email",user);
       const res = await this._iuserRepository.findByEmail(user.email);

       console.log("res" , res);
       if (res) {
        console.log("kkkkkklllll");
        return {status:200, success:false, message: 'User found' }; 
        }else{
            const otp = this._generateOtp.createOtp();
            console.log("otpppppp",otp);
         await this._sendEmailOtp.sendEmail(user.email , otp);
         const userOtp = await this._iuserRepository.saveOtp(user.email , otp);
         const token =  this._jwtToken.otpToken(user);
         console.log("token" , token);
         return {status:200 , success:true , userOtp , token };
        }
   
   }

   async saveUser(userOtp:string , token:string) {
    
        console.log("hereee")
    const decodedToken = this._jwtToken.verifyToken(token);
    console.log("decodedToken",decodedToken?.info.email);
    
    const otp = await this._iuserRepository.findOtp(decodedToken?.info.email);
    console.log("ss", userOtp);
    console.log("user otp" , otp?.otp);
    const password = decodedToken?.info.password;
    const hashedPassword =  await this._hashPassword.hash(password)
    console.log("hashedPassword" , hashedPassword);
    if(userOtp == otp?.otp){
        const res =  await this._iuserRepository.insertUser(decodedToken?.info , hashedPassword);
        console.log("usesdlksmr" , res.user.id);
        const authToken = this._jwtToken.authToken( res.user.id ,res.user.email, "User");
        const refreshToken = this._jwtToken.refreshToken(res.user.id ,res.user.email, "User")
        console.log("authToken" , authToken);
        

        if(res) {
            return {success:true , message:"user saved successfully" , authToken:authToken ,refreshToken };
        }
    }
    return {success : false , message:"Invalid otp"}
    
   }

   async verifyLogin(email:string , userPassword:string) {
     
        const user = await this._iuserRepository.findByEmail(email);
     console.log("uerrrrrrrrr" , user);
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

   }

   async getCateogries() {
   
        const category = await this._iuserRepository.getCategoryData();
   if(category) {
    return {success:true  ,category};
   }else{
    return {sucess:false , message:"something went wrong"}; 
   }
  
   }

   async getUserDetails(token:string) {
    console.log("t" , token);
    const decodedToken = this._jwtToken.verifyToken(token);
    console.log("dec" , decodedToken);
    const user = await this._iuserRepository.findById(decodedToken?.id);
    if(user){
        return {success:true , message:"user matched succesfully" ,user};
    }else{
        return {success:false , message:"no user found"};
    }
   }

   async updateUserDetails(id:any ,name:string , mobile:string) {
    const user = await this._iuserRepository.editUserDetails(id , name  , mobile);
    if(user) {
        return {success:true , message:"user updated succesfully" ,user};
    }else{
        return {success:false , message:"no user found"};
    }
   }

   async getInstructorDetails(page:number , limit:number , search:any , category :any) {
    const {instructor , total} = await this._iuserRepository.getInstructor(page , limit , search , category);
    return {success:true , message:"instructors found" , instructor , total};
   }

   async resendOtpByEmail(token:string) {
    const decodedToken = this._jwtToken.verifyToken(token);
    console.log("decc" , decodedToken);
    if(decodedToken) {
        const otp = this._generateOtp.createOtp();
        console.log("otpppppp",otp);
        await this._sendEmailOtp.sendEmail(decodedToken.info.email , otp);
        const otpData = await this._iuserRepository.findOtp(decodedToken.info.email);
        if(otpData) {
            const updatedOtp = await this._iuserRepository.updateOtpByEmail(decodedToken.info.email , otp);
            console.log("update" , updatedOtp);
            return {success:true , message:"otp resend successfully" , updatedOtp};
        }else{
            const savedOtp = await this._iuserRepository.saveOtp(decodedToken.info , otp);
            console.log("sav",savedOtp);
            return {success:true , message:"otp resend successfully" , savedOtp};
        }
       
    }
    console.log("jjj00")
    return {success:false , message:"something went wrong"};
}

    async changeUserPassword(token:string , current:string , confirm:string) {
        const decodedToken = this._jwtToken.verifyToken(token);
        if(decodedToken) {
            const user = await this._iuserRepository.findByEmail(decodedToken.email);
            if(user && user.password) {
                const isPasswordMatched = await this._hashPassword.compare(current , user?.password)
                if(isPasswordMatched) {
                    const hashedPassword = await this._hashPassword.hash(confirm);
                    const updatedUser = await this._iuserRepository.changePassword(user.email ,hashedPassword);
                    if(updatedUser) {
                        return {success:true , message:'password updated successfully' , updatedUser};
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

    async getInstructorDetail(id:any , token:any) {
        const decodedToken = this._jwtToken.verifyToken(token);
        const instructor = await this._iuserRepository.getInstructorId(id);

        if(instructor) {
            const review = await this._iuserRepository.getReviewById(id)
            const isReview = await this._iuserRepository.reviewExist(id , decodedToken?.id)
            return {success:true , message:"instructor found successfully" , instructor  , review , isReview} ;
        }else{
            return {success:false , message:"instructor not found"};
        }
    }

    async payement(info:any ,token:string) {
        console.log("info" , info);
        const decodedToken = this._jwtToken.verifyToken(token);

        const res = await this._stripe.stripePayement(info ,decodedToken?.id);
        if(res) {
            return res
        }else{
            console.log("payement failed")
        }
    }

    async successPayment(session:any) {
        console.log("sessionff" , session.metadata);
        const {instructorId , userId , id , price} = session.metadata;
        const slot = await this._iuserRepository.createSlot(session.metadata);
        const updatedStatus = await this._iuserRepository.updateEventStatus(id);
        const priceNumber = parseFloat(price);
        let percent = price * 0.15
        let amount =  priceNumber - (price * 0.15)
        let type = "credit"
        const wallet = await this._iuserRepository.createInstructorWallet(instructorId , amount , type ,percent);
        
    }

    async getSlotDetails(token:any) {
        const decodedToken = this._jwtToken.verifyToken(token);
        console.log("dee" , decodedToken);

        const slot = await this._iuserRepository.findSlots(decodedToken?.id);
        if(slot) {
            return {success:true , message:"slots found successfully" , slot}
        }else{
            return {success:false , message:"not found"}
        }
        
    }

    async updateUserImg(token:string , img:string) {
        const decodedToken = this._jwtToken.verifyToken(token);
        console.log("dee" , decodedToken);
        
        const image = await this._iuserRepository.updateImg(decodedToken?.id , img);
        console.log("image" , image)
        if(image) {
            return {success:true , message:"image update successfully" , image};
        }else{
            return {success:false , message:"something went wrong"}
        }
    }

    async getUserImg(token:any) {
        const decodedToken = this._jwtToken.verifyToken(token);
        console.log("dee" , decodedToken);

        const image = await this._iuserRepository.getImgById(decodedToken?.id);
        if(image) {
            return {success:true , message:"image fetched successfully" , image};
        }else{
            return {success:false , message:"something went wrong"}
        }
    } 

    async verifyRoomId(roomId:any , userId:any) {
        const data = await this._iuserRepository.verifyRoomById(roomId);
        console.log("data" , data);
        if(data) {
            if(data.userId == userId) {
                return {success:true };
            }else{
                return {success:false}
            }
        }
        return {success:false}
    }

    async updateRating(rating:any , slotId:any) {
        const data = await this._iuserRepository.updateSlotById(rating , slotId);
        if(data) {
            return {success:true };
        }else{
            return {success:false}
        }
        
    }
   
    async googleCallback(email:any , name:any , img:any) {
        const user = await this._iuserRepository.createUserByGoogle(email , name , img);
        console.log("user",user);
        if(user) {
            const token = await this._jwtToken.authToken(user.id , user.email , "User");
            if(token) {
                return {success:true , message:"authentication successfull" , user , authToken:token};
            }else{
                return {succes:false , message:"something went wrong"};
            }
        }
        return {success:false , message:"something went wrong"};
    }

    async addInstructorReview(instructorId:any , value:string , token:string){
        const decodedToken = this._jwtToken.verifyToken(token);
        if(decodedToken) {
            const res = await this._iuserRepository.addReview(instructorId , value , decodedToken.id);
            if(res) {
                return {success:true , message:"review added successfully"};
            }else{
                return {success:false , message:"something went wrong"}
            }
        }
    }

    async verifyRefreshToken(refreshToken:string){
        const verifiedToken = this._jwtToken.verifyToken(refreshToken);
        console.log("verifyRefreshToken" ,verifiedToken);
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

        
    }
}

export default userUseCase