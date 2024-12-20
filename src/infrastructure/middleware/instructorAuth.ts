import { Request, Response, NextFunction } from "express";
import jwt from "../service/jwt"

const jwtToken = new jwt();

const instructorAuth =  async(req: Request, res: Response, next: NextFunction):Promise<any> => {
const instructorToken = req.cookies.authToken;
if(!instructorToken) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const verifiedToken = jwtToken.verifyToken(instructorToken);

    if(verifiedToken?.exp){
        if (!verifiedToken || Date.now() >= verifiedToken?.exp * 1000) {
          return res.status(401).json({ success: false, message: "Token expired" });
        }
      }
      next()
  }catch(err) {
    console.log(err); 
    return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
  }
}

export default instructorAuth;