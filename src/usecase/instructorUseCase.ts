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
      
            console.log("instructor" , instructor);
        const {email} = instructor

        const res = await this._instructorRespository.findByEmail(email);
        if(res) {
            return {status:200 , success:false , message:"user found" };
        }else{
            const otp = this._generateOtp.createOtp();
            console.log("otpppppp",otp);
            await this._sendEmailOtp.sendEmail(email , otp);
            const instructorOtp = await this._instructorRespository.saveOtp(email , otp);
            console.log("instructorOtp" ,instructorOtp);
            const token = this._jwt.otpToken(instructor);
            console.log("kkkkkkkkkkt" , token);
            return {status:200 , success:true , instructorOtp , token };
        }
    
    }

    async saveInstructor(instructorOtp:string , token:string) {
       
         const decodedToken = this._jwt.verifyToken(token);
        console.log("jjjjj",decodedToken);
        const otp = await this._instructorRespository.findOtpByEmail(decodedToken?.info.email);
        console.log("otppp",otp);
        const hashedPassword = await this._hashPassword.hash(decodedToken?.info.password);
        console.log("hashed" , hashedPassword);
        console.log("instructorOtp",instructorOtp)
        console.log("ott" , otp?.otp)
        if(otp?.otp == instructorOtp) {
            console.log("kkkkk")
            const instructor = await this._instructorRespository.insertInstructor(decodedToken?.info , hashedPassword);
            if(instructor) {
                const authToken = this._jwt.authToken(instructor.id , instructor.email , "Instructor");
                console.log("authToken" , authToken);
                return {success:true , message:"user saved successfully" ,authToken:authToken};
            }
        }
        return {success:false , message:"Invalid Otp"};
   

    }

    async verifyLogin(email:string , instructorpassword:string) {
      
         const instructor = await this._instructorRespository.findByEmail(email);
        if(instructor) {
            const password = await this._hashPassword.compare(instructorpassword , instructor.password);
            const token = this._jwt.authToken( instructor.id , instructor.email , "Instructor")

            if(password) {
                
                return {success:true , message:"user matched succesfully" , authToken:token};

            }else{
                return {success:false , message:"Invalid password"};
            }

        }else{
            return {success:false , message:"Invalid Email"};
        }
    
    }
}

export default instructorUseCase;