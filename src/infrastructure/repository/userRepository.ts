import { PrismaClient  , Prisma} from "@prisma/client";
import User from "../../entity/User";
import IuserRepository from "../../interface/repository/IuserRepository";
import Otp from "../../entity/Otp";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import { Events } from "../../entity/Session";
import Review from "../../entity/Review";
import { injectable } from "inversify";
import { GenericRepository } from "./GenericRepository";
import prisma from "../service/prismaClient";

@injectable()
export class UserRepository extends GenericRepository<User> implements IuserRepository {
  constructor() {
    super(prisma, prisma.user);
  }
    async findByEmail(email: string): Promise<User | null> {
        
        const user = await prisma.user.findUnique({
            where:{email}
        })
        
        return user
    }
   async saveOtp(email: string, UserOtp: string): Promise<Otp | null> {
    
    const userOtp = await prisma.otp.create({
        data: {
          email: email,
          otp: UserOtp,
        },
      });
      
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

   async editUserDetails(id:string ,name: string,  mobile: string): Promise<User | null> {
       const updatedUser = await prisma.user.update({
        where:{
          id:id
        },
        data:{
          name:name,
          mobile:mobile
        }
       })
       

      if(updatedUser) {
        return updatedUser
      }

      return null;
         }

        async findById(id: string): Promise<User | null> {
          const user = await prisma.user.findUnique({
            where:{
              id:id
            }
          })

          return (user) ? user : null
             
         }

        async getInstructor(page: number, limit: number , search:string , category:string): Promise<{ instructor: Instructor[] | null; total: number; }> {
          const skip = (page - 1) * limit;
          

          const whereClause = {
            AND: [
              search
                ? {
                    OR: [
                      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
                      {
                        specializations: {
                          has: search, 
                          
                        },
                      }
                      
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

         async getInstructorId(id: string): Promise<Instructor | null> {
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
          
          if(data) {
            return data
          }
          return null
      }

      async getReviewById(id: string): Promise<Review[] | null> {
          const review  = await prisma.review.findMany({
            where:{
              instructorId:id
            },
            orderBy:{
              createdAt:'desc'
            },
            take:4,
            include:({user:true})
          })
          
          if(review) {
            return review
          }
          return null
      }

      async reviewExist(instructorId: string, userId: string): Promise<boolean> {
          const data = await prisma.review.findFirst({
            where:{
              instructorId:instructorId,
              userId:userId
            }
          })
          if(data) {
            return true
          }
          return false
      }

     async createSlot(details: any): Promise<Slot | null > {
      try{

        const existingSlot = await prisma.slot.findFirst({
          where: {
              startTime: details.start,
              endTime: details.end,
              roomId: details.roomId,
              userId: details.userId,
              instructorId: details.instructorId,
          },
      });
  
      if (existingSlot) {
          console.log("Duplicate slot detected, not creating a new one");
          return null;
      }
  
  
      const slot = await prisma.slot.create({
          data: {
              title: details.title,
              startTime: details.start,
              endTime: details.end,
              roomId: details.roomId,
              userId: details.userId,
              instructorId: details.instructorId,
          },
      });
  
      return slot;
      }catch(err:any){
        return null
      }
      }

      async updateEventStatus(id: string): Promise<Events | null> {
      
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

      async createInstructorWallet(id: string , amount:number , type:any , percent:any): Promise<boolean> {
        
        const admin = await prisma.admin.findFirst();
        
         await prisma.admin.update({
          where:{
            id:admin?.id
          },
          data:{
           walletBalance: admin?.walletBalance + percent
          }
        })



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
                  type: type,
                  walletId: existingWallet.id,
              },
          });
          return true;
      } else {
         
          const newWallet = await prisma.wallet.create({
              data: {
                  instructorId: id,
                  balance: amount, 
              },
          });

         
          await prisma.transaction.create({
              data: {
                  amount: amount,
                  type: type, 
                  walletId: newWallet.id,
              },
          });
          return true;
      }
      
          return false
      }

      async findSlots(id: string): Promise<User | null> {
        
          const userSlot = await prisma.user.findUnique({
            where:{
              id:id
            },
            include: {
              slots: {
                  orderBy: {
                      createdAt: 'desc',
                  },
              },
          },
          })

         

         if(userSlot) {
          return userSlot
          }
         

         return null
      }

      async updateImg(id: string, img: string): Promise<string | null> {
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

    async getImgById(id: string): Promise<string | null> {
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

    async verifyRoomById(roomId: string): Promise<Slot | null> {
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

    async updateSlotById(rating: number, slotid: string): Promise<Slot | null> {

     
        const data = await prisma.slot.update({
          where:{
            id:slotid
          },
          data:{
            isRated:true
          }
        })
        

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
          
          return data;
        }



        return null
    }

    async createUserByGoogle(email: string, name: string, img: string): Promise<User | null> {
        const data = await prisma.user.findUnique({
          where:{
            email:email
          }
        })
        if(data) {
          return data
        }else{
          const userData = await prisma.user.create({
            data:{
              name:name,
              email:email,
              img:img,
              isGoogleAuth:true
            }
          })

          return userData;
        }
      return null
    }

    async addReview(instructorId: string, value: string, userId: string): Promise<boolean> {
      
      const data = await prisma.review.create({
        data:{
          value:value,
          instructorId:instructorId,
          userId:userId,
            
          }
        })
       
        if(data) {
          return true
        }
        return false
      }

      async getRoomStatus(roomId: string): Promise<boolean | undefined> {
          const slot = await prisma.slot.findFirst({
            where:{roomId}
          })
          if(slot){
            return slot.hasInstructorJoined
          }

      }

}
