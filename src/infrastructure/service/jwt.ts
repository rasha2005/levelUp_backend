import jwt from "jsonwebtoken";
import Ijwt from "../../interface/services/Ijwt";
import User from "../../entity/User";
import Instructor from "../../entity/Instructor";

class Jwt implements Ijwt {

    otpToken(info: User | Instructor): string {
        const payload = { info };
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '365d' });
        return token;
    }


    verifyToken(token: string) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!); 
        console.log('Decoded token:', decoded);
        return decoded;
        
    }

}

export default Jwt;