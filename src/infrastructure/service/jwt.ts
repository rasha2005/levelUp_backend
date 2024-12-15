import jwt, { JwtPayload } from "jsonwebtoken";
import Ijwt from "../../interface/services/Ijwt";
import User from "../../entity/User";
import Instructor from "../../entity/Instructor";

class Jwt implements Ijwt {

    otpToken(info: User | Instructor): string {
        const payload = { info };
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '365d' });
        return token;
    }


    verifyToken(token: string) : any {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
            return decoded;
          } catch (err:any) {
            // Check if it's an expiration error
            if (err.name === "TokenExpiredError") {
              // Decode the token to extract the payload for additional checks
              const decoded = jwt.decode(token) as JwtPayload;
              return decoded; // Return the decoded payload (without verification)
            }
            console.log("JWT verification error:", err);
            return null;
          }
        
    }

    authToken(id:any ,email: string ,role:string): string {
        const payload = {id, email  , role};
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '25m' });
        return token;
    }

    refreshToken(id: any, email: string, role: string): string {
        const payload = {id , email , role};
        const token = jwt.sign(payload , process.env.SECRET_KEY! , {expiresIn: "7d"});
        return token
    }

}

export default Jwt;