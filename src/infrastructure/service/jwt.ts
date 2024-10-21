import jwt from "jsonwebtoken";
import Ijwt from "../../interface/services/Ijwt";
import User from "../../entity/User";

class Jwt implements Ijwt {

    otpToken(user: User): string {
        const payload = { user };
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