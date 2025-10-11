import { Request, Response, NextFunction } from "express";
import jwt from "../service/jwt";
import {UserRepository} from "../repository/userRepository";

const jwtToken = new jwt();
const userRepository = new UserRepository();

const VALID_ROLES = ["User", "Admin", "Instructor"];

const Auth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authToken = req.cookies?.authToken;
  const refreshToken = req.cookies?.refreshToken;
  const queryToken = req.query?.token as string | undefined;
  if (!authToken && !queryToken) {
  
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const tokenToVerify = authToken || queryToken;
    const verifiedToken = jwtToken.verifyToken(tokenToVerify);

    if (verifiedToken?.exp && Date.now() >= verifiedToken.exp * 1000) {
      if (refreshToken) {
  
        try {
          jwtToken.verifyToken(refreshToken); 
        } catch (err) {
          return res.status(401).json({ message: "Token expired" });
        }
      }
      return res.status(401).json({ message: "Token expired" });
    }

  
    if (!VALID_ROLES.includes(verifiedToken.role)) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid role" });
    }

  
    if (verifiedToken.role === "User") {
      if (!verifiedToken.email) {
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
      }

      const userData = await userRepository.findByEmail(verifiedToken.email);
      if (userData?.isBlocked) {
        const isProd = process.env.NODE_ENV === "production";

        res.clearCookie("authToken", {
          path: '/',
          domain: isProd ? ".levelup.icu" : undefined,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
        });
        
        res.clearCookie("refreshToken", {
          path: '/',
          domain: isProd ? ".levelup.icu" : undefined,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
        });
        return res.status(403).send({ success: false, message: "User blocked" });
      }
    }

    req.app.locals.decodedToken = verifiedToken;
    next();

  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export default Auth;
