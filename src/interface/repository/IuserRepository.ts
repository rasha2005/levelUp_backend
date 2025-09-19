import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";
import Slot from "../../entity/Slot";
import User from "../../entity/User";
import {Events} from "../../entity/Session";
import Review from "../../entity/Review";
import { Test } from "../../entity/Test";
import Question from "../../entity/Question";


interface IuserRepository {
    findByEmail(email:string) : Promise<User | null>
    saveOtp(email:string , otp:string) : Promise<Otp | null>
    findOtp(email:string):Promise<Otp | null>
    insertUser(userInfo:User , password:string) : Promise<any>
    getCategoryData(): Promise<Category[] | null>
    editUserDetails(id:any ,name:string ,  mobile:string) : Promise<User | null>
    findById(id:string): Promise<User | null>
    getInstructor(page:number , limit:number , search:any , category:any) : Promise<{instructor:Instructor[] | null , total:number}>
    updateOtpByEmail(email:string , otp:string): Promise<Otp | null>
    changePassword(email:string , password:string): Promise<User | null>
    getInstructorId(id:string):Promise<Instructor | null>
    getReviewById(id:string): Promise<Review[] | null>
    reviewExist(instructorId:string , userId:string): Promise<boolean>
    createSlot(data:any): Promise<Slot | null >
    updateEventStatus(id:string): Promise<Events | null >
    createInstructorWallet(id:any, amount:number , type:any , percent:any): Promise<boolean>
    findSlots(id:string): Promise<User | null>
    updateImg(id:string , img:string): Promise<string | null>
    getImgById(id:string): Promise<string | null>
    verifyRoomById(roomId:string): Promise<Slot | null>
    updateSlotById(rating:number , slotid:string): Promise<Slot | null>
    createUserByGoogle(email:string , name:string , img:string ): Promise<User | null>
    addReview(instructorId:string , value:string , userId:string): Promise<boolean>
    getRoomStatus(roomId:string): Promise<boolean | undefined>
    getTests(slotId:string): Promise<Test | null>
    getQuestion(qId:string): Promise<Question | null>
    updateResult(slotId:string , score:number): Promise<boolean>


}

export default IuserRepository;