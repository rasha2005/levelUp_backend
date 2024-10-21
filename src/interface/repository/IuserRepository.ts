import Otp from "../../entity/Otp";
import User from "../../entity/User";


interface IuserRepository {
    findByEmail(email:string) : Promise<User | null>
    saveOtp(email:string , otp:string) : Promise<Otp | null>
    findOtp(email:string):Promise<Otp | null>
    insertUser(userInfo:User , password:string) : Promise< string>
}

export default IuserRepository;