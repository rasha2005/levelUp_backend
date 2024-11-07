import { PrismaClient } from "@prisma/client";
import User from "../../entity/User";
import IuserRepository from "../../interface/repository/IuserRepository";
import Otp from "../../entity/Otp";
import hashPassword from "../service/hashPassword";
import Category from "../../entity/Category";

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

    async insertUser(userInfo: User , password:string): Promise<any> {
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

   async getCategoryData(): Promise<Category[] | null> {
    const catData = await prisma.category.findMany();
    if(catData) {
      return catData;
    }
    return null;
       
   }

   async editUserDetails(id:any ,name: string, email: string, mobile: string): Promise<User | null> {
       const updatedUser = await prisma.user.update({
        where:{
          id:id
        },
        data:{
          name:name,
          email:email,
          mobile:mobile
        }
       })
       console.log("update" , updatedUser);

      if(updatedUser) {
        return updatedUser
      }

      return null;
         }

        async findById(id: any): Promise<User | null> {
          const user = await prisma.user.findUnique({
            where:{
              id:id
            }
          })

          return (user) ? user : null
             
         }
}

export default  userRepository