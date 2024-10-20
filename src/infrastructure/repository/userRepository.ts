import { PrismaClient } from "@prisma/client";
import User from "../../entity/User";
import IuserRepository from "../../interface/repository/IuserRepository";
import Otp from "../../entity/Otp";

const prisma  = new PrismaClient();

class userRepository implements IuserRepository {
    async findByEmail(email: string): Promise<User | null> {
        console.log("iiiiiiii")
        const user = await prisma.user.findUnique({
            where:{email}
        })
        console.log("userrrr" , user)
        return user
    }
   async saveOtp(email: string, UserOtp: string): Promise<Otp | null> {
    console.log("lllllllll")
    const userOtp = await prisma.otp.create({
        data: {
          email: email,
          otp: UserOtp,
        },
      });
      console.log("repo" , userOtp)
      return userOtp;
   }
    
}

export default  userRepository