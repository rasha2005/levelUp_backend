import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";
import { Session } from "../../entity/Session";
import Slot from "../../entity/Slot";
import User from "../../entity/User";

interface IinstructorRepository {
    findByEmail(email:string):Promise<Instructor | null>
    saveOtp(email:string , instructorOtp:string): Promise<Otp | null>
    findOtpByEmail(email:string): Promise<Otp | null>
    insertInstructor(insructor:Instructor , hashedPassword:string): Promise<any>;
    getCategoryList(): Promise<Category[] | null>
    updateInstructorDetials(email:string ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string): Promise<Instructor | null >;
    getInstructorByEmail(email:string) :Promise<Instructor | null>
    editInstructorByEmail(email:string , name:string , mobile:string) :Promise<Instructor | null>
    updateProfileByEmail(email:string , img:string):Promise<Instructor | null>
    updateOtpByEmail(email:string , otp:string): Promise<Otp | null>
    changePassword(email:string , password:string): Promise<Instructor | null>
    scheduleSession(id:any , title:string , start:string , end:string , price: string ): Promise<Session | null>
    getEventsById(id:any): Promise<Session | null>
    deleteEventById(id:any , instructorId:string): Promise<boolean>
    getSlotList(id:any): Promise<Slot[] | null>
    findWallet(token:any): Promise<any>
    getImgById(id:any): Promise<string | null>
}

export default IinstructorRepository;