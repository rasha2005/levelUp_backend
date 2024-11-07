import User from "../entity/User";
import IuserRepository from "../interface/repository/IuserRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";

class userUseCase {
    constructor (
        private _iuserRepository: IuserRepository,
        private _generateOtp: IgenerateOtp,
        private _sendEmailOtp: IsendEmailOtp,
        private _jwtToken : Ijwt,
        private _hashPassword : IhashPassword,
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
        console.log("authToken" , authToken);

        if(res) {
            return {success:true , message:"user saved successfully" , authToken:authToken};
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
     if(user) {
        const password =  await this._hashPassword.compare(userPassword , user.password);
        const token = this._jwtToken.authToken(user.id,user.email ,"User")
        if(password) {
            return {success:true , message:"user matched succesfully" ,authToken:token};
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

   async updateUserDetails(id:any ,name:string , email:string , mobile:string) {
    const user = await this._iuserRepository.editUserDetails(id , name , email , mobile);
    if(user) {
        return {success:true , message:"user updated succesfully" ,user};
    }else{
        return {success:false , message:"no user found"};
    }
   }


}

export default userUseCase