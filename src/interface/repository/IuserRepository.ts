import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";
import Slot from "../../entity/Slot";
import User from "../../entity/User";
import {Events} from "../../entity/Session";
import Review from "../../entity/Review";


interface IuserRepository {
    findByEmail(email:string) : Promise<User | null>
    saveOtp(email:string , otp:string) : Promise<Otp | null>
    findOtp(email:string):Promise<Otp | null>
    insertUser(userInfo:User , password:string) : Promise<any>
    getCategoryData(): Promise<Category[] | null>
    editUserDetails(id:any ,name:string ,  mobile:string) : Promise<User | null>
    findById(id:any): Promise<User | null>
    getInstructor(page:number , limit:number , search:any , category:any) : Promise<{instructor:Instructor[] | null , total:number}>
    updateOtpByEmail(email:string , otp:string): Promise<Otp | null>
    changePassword(email:string , password:string): Promise<User | null>
    getInstructorId(id:any):Promise<Instructor | null>
    getReviewById(id:any): Promise<Review[] | null>
    reviewExist(instructorId:any , userId:any): Promise<boolean>
    createSlot(data:any): Promise<Slot | null>
    updateEventStatus(id:any): Promise<Events | null >
    createInstructorWallet(id:any, amount:number , type:any , percent:any): Promise<boolean>
    findSlots(id:string): Promise<User | null>
    updateImg(id:any , img:string): Promise<string | null>
    getImgById(id:any): Promise<string | null>
    verifyRoomById(roomId:any): Promise<Slot | null>
    updateSlotById(rating:any , slotid:any): Promise<Slot | null>
    createUserByGoogle(email:any , name:any , img:any ): Promise<User | null>
    addReview(instructorId:any , value:string , userId:string): Promise<boolean>
}

export default IuserRepository;