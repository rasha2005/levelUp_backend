import { injectable } from "inversify";
import Admin from "../../entity/Admin";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import User from "../../entity/User";
import IadminRepository from "../../interface/repository/IadminRepository";
import { GenericRepository } from "./GenericRepository";
import prisma from "../service/prismaClient";


@injectable()
export class AdminRepository extends GenericRepository<Admin> implements IadminRepository {
    constructor() {
        super(prisma, prisma.user);
      }

   async insert(email: string, password: string): Promise<Admin | null> {
        const savedAdmin = await prisma.admin.create({
            data:{
             email:email,
             password:password
            }
     
           })
           return savedAdmin;

    }

     async findByEmail(email: string): Promise<Admin | null> {
        const admin = await prisma.admin.findUnique({
            where:{email}
        })

        return admin;
    }

    async getUser(): Promise<User[] | null> {
        const users = await prisma.user.findMany();
        return users
    }
    
    async getInstructor(): Promise<Instructor[] | null> {
        const Instructors = await prisma.instructor.findMany();
        return Instructors ;
    }

    async createCategory(name:string): Promise<Category | null> {
        const existingCat = await prisma.category.findUnique({
            where: {
                catName: name,
            },
        });
        
        if (existingCat) {
            return null;
        }
        const catData = await prisma.category.create({
            data:{
                catName:name
            }
        });
        return catData
    }

    async getCatData(): Promise<Category[] | null> {
        const category = await prisma.category.findMany();
        return category;

    }

    async editCatData(name:string , id:string): Promise<Category[] | null> {
        const existingCat = await prisma.category.findUnique({
            where: {
                catName: name,
            },
        });
        
        if (existingCat) {
            return null;
        }
        try {
            const updatedCategory = await prisma.category.update({
                where: {
                    id: id,
                },
                data: {
                    catName: name, 
                },
            });
            
            return updatedCategory ? [updatedCategory] : null;
        } catch (error) {
            console.error("Error updating category:", error);
            return null;
        }
       
    }

    async deleteCatData(id: string): Promise<boolean> {
        const catData = await prisma.category.delete({
            where:{
                id:id
            }
        })
        return true
    }

    async  blockUser(id: string): Promise<User | null> {
        const existingUser = await prisma.user.findUnique({
            where: { id }
          });
        
          if (!existingUser) return null;
        
         
          const updatedUser = await prisma.user.update({
            where: { id },
            data: { isBlocked: !existingUser.isBlocked }
          });
        

        return updatedUser
        
    }

    async getInstructorId(id: string): Promise<Instructor | null> {
        const data = await prisma.instructor.findUnique({
            where:{
                id:id
            }
        })
        if(data) {
            return data
        }
        return null
    }

     async updateInstructorApprovel(id:string): Promise<Instructor | null> {
        const data = await prisma.instructor.update({
            where:{
                id:id
            },
            data:{
                isApproved:true
            }
        })
        if(data) {
            return data
        }
        return null
    }

    async cancelApprovel(id: string): Promise<Instructor | null> {
        const data = await prisma.instructor.update({
            where:{
                id:id
            },
            data:{
                isApproved:false
            }
        })
        if(data) {
            return data
        }
        return null
    }


    async getUserId(id: string): Promise<User | null> {
        const data = await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        if(data) {
            return data
        }
        return null
    }

    async findSlotsByDate(date: any): Promise<any> {
        const dateOnly = date.toISOString().split('T')[0]
        const data = await prisma.slot.findMany({
            where: {
                startTime: {
                    gte: new Date(dateOnly + "T00:00:00.000Z"), 
                    lt: new Date(dateOnly + "T23:59:59.999Z"),  
                },
            },
            include:{user:true}
        })
       if(data) {
        return data
       }
       return null
    }

    async findWallet(): Promise<Admin | null> {
        const admin = await prisma.admin.findFirst();
        return admin
    }

    async getTransactionDetails(): Promise<any> {
        const details = await prisma.instructor.findMany({
            select: {
                id: true, 
                name: true, 
                wallet: {
                  select: {
                    id: true,
                    balance: true, 
                    transactions: {
                      select: {
                        id: true, 
                        amount: true, 
                        createdAt: true, 
                      },
                    },
                  },
                },
              },
        });
    
       

        return details
    }
}
