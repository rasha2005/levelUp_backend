import { Request, Response, NextFunction } from "express";
import jwt from "../service/jwt"
import userRepository from "../repository/userRepository";


const jwtToken = new jwt()
const UserRepository = new userRepository();


const userAuth =  async(req: Request, res: Response, next: NextFunction):Promise<any> => {
  const usertoken = req.cookies.authToken;
  const token:any = req.query.token;
  console.log("kkkk" , token);

  if(!usertoken && !token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  try {
    let verifiedToken
    if(usertoken){
       verifiedToken = jwtToken.verifyToken(usertoken);
    }else{
      verifiedToken = jwtToken.verifyToken(token);
    }
    console.log("verifiedTokenk",verifiedToken);
    
    if(verifiedToken?.exp){
      if (!verifiedToken || Date.now() >= verifiedToken?.exp * 1000) {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
    }
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