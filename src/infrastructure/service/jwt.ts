import jwt from "jsonwebtoken";
import Ijwt from "../../interface/services/Ijwt";

class Jwt implements Ijwt {

    otpToken(email: string): string {
        const payload = { email };

    
    const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '15m' }); 

    return token;
    }

}

export default Jwt;