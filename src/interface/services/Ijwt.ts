import User from "../../entity/User";

interface Ijwt {
    otpToken(user:User):string;
    verifyToken(token:string) :any
}

export default Ijwt;