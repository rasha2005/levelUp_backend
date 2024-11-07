import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";

interface IinstructorRepository {
    findByEmail(email:string):Promise<Instructor | null>
    saveOtp(email:string , instructorOtp:string): Promise<Otp | null>
    findOtpByEmail(email:string): Promise<Otp | null>
    insertInstructor(insructor:Instructor , hashedPassword:string): Promise<any>
}

export default IinstructorRepository;