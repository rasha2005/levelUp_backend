import { Request, Response, NextFunction } from "express";
import jwt from "../service/jwt"
import userRepository from "../repository/userRepository";


const jwtToken = new jwt()
const UserRepository = new userRepository();

const VALID_ROLES = ["User", "Admin", "Instructor"];

const userAuth =  async(req: Request, res: Response, next: NextFunction):Promise<any> => {
  const authToken = req.cookies.authToken;
  const token:any = req.query.token;
  console.log("kkkk" , token);

  if(!authToken && !token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  try {
    let verifiedToken
    if(authToken){
       verifiedToken = jwtToken.verifyToken(authToken);
    }else{
      verifiedToken = jwtToken.verifyToken(token);
    }
    
    
    if(verifiedToken?.exp){
      if (!verifiedToken || Date.now() >= verifiedToken?.exp * 1000) {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
    }
    if(!VALID_ROLES.includes(verifiedToken.role) ){
     
        return res.status(401).send({success: false, message: "Unauthorized - Invalid Token"})
    }

    if (verifiedToken.role === 'User') {
      if (verifiedToken.email) {
        try {
          const userData = await UserRepository.findByEmail(verifiedToken.email);
    
          if (userData?.isBlocked) {
            res.clearCookie("authToken");
            return res.status(403).send({ success: false, message: "User blocked" });
          }
          req.app.locals.decodedToken = verifiedToken;
         
          next();
        } catch (err) {
          console.error("Error fetching user data:", err);
          return res.status(500).send({ success: false, message: "Internal server error" });
        }
      } else {
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid Token" });
      }
    } else if (verifiedToken.role === 'Instructor' || verifiedToken.role === 'Admin') {
      next();
    } else {
      return res.status(401).send({ success: false, message: "Unauthorized - Invalid Role" });
    }
    
  }catch(err){
    console.log(err); 
    return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })

  }

}

export default userAuth;