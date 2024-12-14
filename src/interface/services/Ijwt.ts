import { JwtPayload } from "jsonwebtoken";
import Instructor from "../../entity/Instructor";
import User from "../../entity/User";

interface Ijwt {
    otpToken(user:User | Instructor):string;
    verifyToken(token:string) : any;
    authToken( id:any ,email:string , role:string):string
    refreshToken(id:any , email:string , role:string):string
}

export default Ijwt;