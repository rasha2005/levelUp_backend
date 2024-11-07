import { JwtPayload } from "jsonwebtoken";
import Instructor from "../../entity/Instructor";
import User from "../../entity/User";

interface Ijwt {
    otpToken(user:User | Instructor):string;
    verifyToken(token:string) : JwtPayload | null;
    authToken( id:any ,email:string , role:string):string
}

export default Ijwt;