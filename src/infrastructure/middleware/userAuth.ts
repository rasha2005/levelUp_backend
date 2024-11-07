import { Request, Response, NextFunction } from "express";
import jwt from "../service/jwt"
import userRepository from "../repository/userRepository";


const jwtToken = new jwt()
const UserRepository = new userRepository();


const userAuth =  async(req: Request, res: Response, next: NextFunction):Promise<any> => {
  const usertoken = req.cookies.authToken;

  if(!usertoken) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  try {
    
    const verifiedToken = jwtToken.verifyToken(usertoken);
    console.log("verifiedToken",verifiedToken);
    if(verifiedToken && verifiedToken.role !== "User"){
        return res.status(401).send({success: false, message: "Unauthorized - Invalid Token"})
    }

    if(verifiedToken && verifiedToken.email){
      console.log("lllll");
      const userData = await UserRepository.findByEmail(verifiedToken.email);
      if(userData?.isBlocked){
        console.log("hehhe");
        res.clearCookie("authToken");
        return res.status(403).send({success: false, message: "user blocked"})
      }
      next();
    }else{
      
      return  res.status(401).send({success: false, message: "Unauthorized - Invalid Token"})
    }
    
    
  }catch(err){
    console.log(err); 
    return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })

  }

}

export default userAuth;