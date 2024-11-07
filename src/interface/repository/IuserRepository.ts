import Category from "../../entity/Category";
import Otp from "../../entity/Otp";
import User from "../../entity/User";


interface IuserRepository {
    findByEmail(email:string) : Promise<User | null>
    saveOtp(email:string , otp:string) : Promise<Otp | null>
    findOtp(email:string):Promise<Otp | null>
    insertUser(userInfo:User , password:string) : Promise<any>
    getCategoryData(): Promise<Category[] | null>
    editUserDetails(id:any ,name:string , email:string , mobile:string) : Promise<User | null>
    findById(id:any): Promise<User | null>
}

export default IuserRepository;