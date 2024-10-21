import User from "../entity/User";
import IuserRepository from "../interface/repository/IuserRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";

class userUseCase {
    constructor (
        private iuserRepository: IuserRepository,
        private generateOtp: IgenerateOtp,
        private sendEmailOtp: IsendEmailOtp,
        private jwtToken : Ijwt,
        private hashPassword : IhashPassword,
    ){}

   async findUser(user:User) {
       console.log("email",user);
       const res = await this.iuserRepository.findByEmail(user.email);

       console.log("res" , res);
       if (res) {
        console.log("kkkkkklllll");
        return {status:200, success:false, message: 'User found' }; 
        }else{
            const otp = this.generateOtp.createOtp();
            console.log("otpppppp",otp);
         await this.sendEmailOtp.sendEmail(user.email , otp);
         const userOtp = await this.iuserRepository.saveOtp(user.email , otp);
         const token =  this.jwtToken.otpToken(user);
         console.log("token" , token);
         return {status:200 , success:true , userOtp , token };
        }
   }

   async saveUser(userOtp:string , token:string) {
    console.log("hereee")
    const decodedToken = this.jwtToken.verifyToken(token);
    console.log("decodedToken",decodedToken.user.email);
    const otp = await this.iuserRepository.findOtp(decodedToken.user.email);
    console.log("ss", userOtp);
    console.log("user otp" , otp?.otp);
    const password = decodedToken.user.password;
    const hashedPassword =  await this.hashPassword.hash(password)
    console.log("hashedPassword" , hashedPassword);
    if(userOtp == otp?.otp){
        const res =  await this.iuserRepository.insertUser(decodedToken.user , hashedPassword);
        if(res) {
            return {success:true , message:"user saved successfully"};
        }
    }
    return {success : false , message:"Invalid otp"}
   }
}

export default userUseCase