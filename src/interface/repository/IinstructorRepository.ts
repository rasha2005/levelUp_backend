import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";
import { Session } from "../../entity/Session";
import Slot from "../../entity/Slot";
import { Wallet } from "../../entity/Wallet";

interface IinstructorRepository {
    findByEmail(email:string):Promise<Instructor | null>
    saveOtp(email:string , instructorOtp:string): Promise<Otp | null>
    findOtpByEmail(email:string): Promise<Otp | null>
    insertInstructor(insructor:Instructor , hashedPassword:string): Promise<any>;
    getCategoryList(): Promise<Category[] | null>
    updateInstructorDetials(email:string ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string , specialization:string[]): Promise<Instructor | null >;
    getInstructorByEmail(email:string) :Promise<Instructor | null>
    editInstructorByEmail(email:string , name:string , mobile:string) :Promise<Instructor | null>
    updateProfileByEmail(email:string , img:string):Promise<Instructor | null>
    updateOtpByEmail(email:string , otp:string): Promise<Otp | null>
    changePassword(email:string , password:string): Promise<Instructor | null>
    scheduleSession(id:string , title:string , start:string , end:string , price: string ): Promise<Session | null>
    getEventsById(id:string): Promise<Session | null>
    deleteEventById(id:string , instructorId:string): Promise<boolean>
    getSlotList(id:string): Promise<Slot[] | null>
    findWallet(token:string): Promise<Wallet | null>
    getImgById(id:string): Promise<string | null>
    verifyRoomById(roomId:string): Promise<Slot | null>
    updateInstructorJoin(roomId:string):Promise<boolean>
}

export default IinstructorRepository;