import Instructor from "../entity/Instructor";
import IinstructorRepository from "../interface/repository/IinstructorRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";

class instructorUseCase {
    constructor(
        private instructorRespository:IinstructorRepository,
        private generateOtp:IgenerateOtp,
        private sendEmailOtp:IsendEmailOtp,
        private jwt:Ijwt,
        private hashPassword:IhashPassword
    ){}

    async findInsrtuctor(instructor:Instructor) {
        console.log("instructor" , instructor);
        const {email} = instructor

        const res = await this.instructorRespository.findByEmail(email);
        if(res) {
            return {status:200 , success:false , message:"user found" };
        }else{
            const otp = this.generateOtp.createOtp();
            console.log("otpppppp",otp);
            await this.sendEmailOtp.sendEmail(email , otp);
            const instructorOtp = await this.instructorRespository.saveOtp(email , otp);
            console.log("instructorOtp" ,instructorOtp);
            const token = this.jwt.otpToken(instructor);
            console.log("kkkkkkkkkkt" , token);
            return {status:200 , success:true , instructorOtp , token };
        }
    }

    async saveInstructor(instructorOtp:string , token:string) {
        const decodedToken = this.jwt.verifyToken(token);
        console.log("jjjjj",decodedToken);
        const otp = await this.instructorRespository.findOtpByEmail(decodedToken.info.email);
        console.log("otppp",otp);
        const hashedPassword = await this.hashPassword.hash(decodedToken.info.password);
        console.log("hashed" , hashedPassword);
        console.log("instructorOtp",instructorOtp)
        console.log("ott" , otp?.otp)
        if(otp?.otp == instructorOtp) {
            console.log("kkkkk")
            const instructor = await this.instructorRespository.insertInstructor(decodedToken.info , hashedPassword);
            if(instructor) {
                console.log("sssss");
                return {success:true , message:"user saved successfully"};
            }
        }
        return {success:false , message:"Invalid Otp"};

    }

    async verifyLogin(email:string , instructorpassword:string) {
        const instructor = await this.instructorRespository.findByEmail(email);
        if(instructor) {
            const password = await this.hashPassword.compare(instructorpassword , instructor.password)
            if(password) {
                return {success:true , message:"user matched succesfully"};
            }else{
                return {success:false , message:"Invalid password"};
            }

        }else{
            return {success:false , message:"Invalid Email"};
        }
    }
}

export default instructorUseCase;