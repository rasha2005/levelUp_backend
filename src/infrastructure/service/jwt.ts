import jwt, { JwtPayload } from "jsonwebtoken";
import Ijwt from "../../interface/services/Ijwt";
import User from "../../entity/User";
import Instructor from "../../entity/Instructor";

class Jwt implements Ijwt {

    otpToken(info: User | Instructor): string {
        const payload = { info  };
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '365d' });
        return token;
    }


    verifyToken(token: string) : any {
        try {

            const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
            return decoded;
          } catch (err:any) {
            
            if (err.name === "TokenExpiredError") {
             
              const decoded = jwt.decode(token) as JwtPayload;
              return decoded; 
            }
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