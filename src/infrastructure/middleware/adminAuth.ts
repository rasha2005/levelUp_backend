import { Request, Response, NextFunction } from "express";
import jwt from "../service/jwt"



const jwtToken = new jwt()



const adminAuth =  async(req: Request, res: Response, next: NextFunction):Promise<any> => {
    const admintoken = req.cookies.authToken;
  
    if(!admintoken) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
      
      const verifiedToken = jwtToken.verifyToken(admintoken);
      
      if(verifiedToken && verifiedToken.role !== "Admin"){
          return res.status(401).send({success: false, message: "Unauthorized - Invalid Token"})
      }

      next();
    }catch(err) {
        console.log(err); 
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    
      }
    
    }

    export default adminAuth;