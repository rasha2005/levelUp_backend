import IuserRepository from "../interface/repository/IuserRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";

class userUseCase {
    constructor (
        private iuserRepository: IuserRepository,
        private generateOtp: IgenerateOtp,
        private sendEmailOtp: IsendEmailOtp,
        private jwtToken : Ijwt
    ){}

   async findUser(userEmail:string) {
       console.log("email",userEmail);
       const res = await this.iuserRepository.findByEmail(userEmail);

       console.log("res" , res);
       if (res) {
        console.log("kkkkkklllll");
        return {status:200, success:false, message: 'User found' }; 
        }else{
            const otp = this.generateOtp.createOtp();
            console.log("otpppppp",otp);
         await this.sendEmailOtp.sendEmail(userEmail , otp);
         const userOtp = await this.iuserRepository.saveOtp(userEmail , otp);
         const token =  this.jwtToken.otpToken(userEmail);
         console.log("token" , token);
         return {status:200 , success:true , userOtp , token };
        }
   }
}

export default userUseCase