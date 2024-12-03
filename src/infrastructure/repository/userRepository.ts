import { PrismaClient  , Prisma} from "@prisma/client";
import User from "../../entity/User";
import IuserRepository from "../../interface/repository/IuserRepository";
import Otp from "../../entity/Otp";
import hashPassword from "../service/hashPassword";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import { Events } from "../../entity/Session";

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

   async updateOtpByEmail(email: string , otp:string): Promise<Otp | null> {
    const otpData = await prisma.otp.update({
        where:{email},
        data:{
            otp:otp
        }
    })
    if( otpData ) {
        return otpData
    };
    return null;
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

   async editUserDetails(id:any ,name: string,  mobile: string): Promise<User | null> {
       const updatedUser = await prisma.user.update({
        where:{
          id:id
        },
        data:{
          name:name,
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

        async getInstructor(page: number, limit: number , search:any , category:any): Promise<{ instructor: Instructor[] | null; total: number; }> {
          const skip = (page - 1) * limit;
          console.log("cat" ,category);

          const whereClause = {
            AND: [
              search
                ? {
                    OR: [
                      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
                      // { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
                    ],
                  }
                : {}, 
              category
                ? { category: { equals: category} }
                : {}, 
            ],
          };
          const instructors = await prisma.instructor.findMany({
            where: whereClause,
            skip,
            take: limit,
          });

          const total = await prisma.instructor.count({
            where: whereClause,
          });
      
          return { instructor: instructors, total };
         }

         async changePassword(email: string, password: string): Promise<User | null> {
             const user = await prisma.user.update({
              where:{
                email:email,
              },
              data:{
                password:password
              }
             })
             if(user) {
              return user;
             }
             return null;
         }

         async getInstructorId(id: any): Promise<Instructor | null> {
          const data = await prisma.instructor.findUnique({
              where:{
                  id:id
              },
              include: {
                scheduledSession: {
                  include: {
                    events: true, 
                  },
                },
              },
          })
          console.log("data" , data);

          if(data) {
            return data
          }
          return null
      }

     async createSlot(details: any): Promise<Slot | null> {
          const slot = await prisma.slot.create({
            data:{
              title:details.title,
              startTime:details.start,
              endTime:details.end,
              roomId:details.roomId,
              userId:details.userId,
              instructorId:details.instructorId
            }
          })
          if(slot) {
            return slot
          }
          return null
      }

      async updateEventStatus(id: any): Promise<Events | null> {
          const updatedData = await prisma.event.update({
            where:{
              id:id
            },
            data:{
              status:"booked"
            }
          })
          if(updatedData) {
            return updatedData;
          }
          return null
      }

      async createInstructorWallet(id: any , amount:number , type:any): Promise<boolean> {
        const existingWallet = await prisma.wallet.findUnique({
          where: { instructorId: id },
      });

      if (existingWallet) {
          
          await prisma.wallet.update({
              where: { instructorId: id },
              data: {
                  balance: existingWallet.balance + amount, 
              },
          });

          
          await prisma.transaction.create({
              data: {
                  amount: amount,
                  type: type, // 'credit' or 'debit'
                  walletId: existingWallet.id,
              },
          });
          return true;
      } else {
          // Create a new wallet
          const newWallet = await prisma.wallet.create({
              data: {
                  instructorId: id,
                  balance: amount, // Initialize with the calculated amount
              },
          });

          // Create a transaction for the new wallet
          await prisma.transaction.create({
              data: {
                  amount: amount,
                  type: type, // 'credit' or 'debit'
                  walletId: newWallet.id,
              },
          });
          return true;
      }
      
          return false
      }

      async findSlots(id: string): Promise<User | null> {
        console.log("kkkktt");
          const userSlot = await prisma.user.findUnique({
            where:{
              id:id
            },
            include: {slots:true},
          })

          console.log("sle" , userSlot);

         if(userSlot) {
          return userSlot
          }
         

         return null
      }

      async updateImg(id: any, img: string): Promise<string | null> {
        if(img) {

          const data = await prisma.user.update({
            where:{
              id:id
            },
            data:{
              img:img
            }
          })
          if(data) {
            return data.img
          }
        }else{
          const data = await prisma.user.findUnique({
            where:{
              id:id
            }
          })
          if(data) {
            return data.img
          }
        }
          
        return null
      }

    async getImgById(id: any): Promise<string | null> {
        const data = await prisma.user.findUnique({
          where:{
            id:id
          }
        })
        if(data) {
          return data.img
        }
        return null
    }

    async verifyRoomById(roomId: any): Promise<Slot | null> {
        const slot = await prisma.slot.findFirst({
          where:{
            roomId:roomId
          }
        })
        if(slot) {
          return slot
        }
        return null
    }

    async updateSlotById(rating: any, slotid: any): Promise<Slot | null> {

     
        const data = await prisma.slot.update({
          where:{
            id:slotid
          },
          data:{
            isRated:true
          }
        })
        console.log("data" , rating);

        if(data) {
          const instructor = await prisma.instructor.update({
            where:{
              id:data.instructorId
            },
            data: {
              rating: {
                increment:rating
              }
            }
          })
          console.log("ins" , instructor)
          return data;
        }



        return null
    }
}

export default  userRepository