import { PrismaClient } from "@prisma/client";
import User from "../../entity/User";
import IuserRepository from "../../interface/repository/IuserRepository";
import Otp from "../../entity/Otp";
import hashPassword from "../service/hashPassword";

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
    
   async findOtp(email: string): Promise<Otp | null> {
    console.log("fjfjkjfkdl")
    const otp = await prisma.otp.findUnique({
      where:{email}
  })
      // const userOtp = otp.otp
        return otp
  
   }

    async insertUser(userInfo: User , password:string): Promise<string|any> {
      const {name , email , mobile} = userInfo;
      const savedUser = await prisma.user.create({
       data:{
        name:name,
        email:email,
        mobile:mobile,
        password:password
       }

      })
      return { success:true , message: "User created successfully", user: savedUser };
       
   }
}

export default  userRepository