import Instructor from "../../entity/Instructor";
import User from "../../entity/User";

interface Ijwt {
    otpToken(user:User | Instructor):string;
    verifyToken(token:string) :any
}

export default Ijwt;