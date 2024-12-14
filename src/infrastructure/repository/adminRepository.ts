import Admin from "../../entity/Admin";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import User from "../../entity/User";
import IadminRepository from "../../interface/repository/IadminRepository";
import { PrismaClient, Wallet } from "@prisma/client";

const prisma = new PrismaClient();

class adminRepository implements IadminRepository {
    constructor(){}

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
            console.log("Category already exists:", existingCat);
            return null;
        }
        const catData = await prisma.category.create({
            data:{
                catName:name
            }
        });
        console.log("catData" , catData);
        return catData
    }

    async getCatData(): Promise<Category[] | null> {
        console.log("eeeee");
        const category = await prisma.category.findMany();
        return category;

    }

    async editCatData(name:string , id:any): Promise<Category[] | null> {
        const existingCat = await prisma.category.findUnique({
            where: {
                catName: name,
            },
        });
        
        if (existingCat) {
            console.log("Category already exists:", existingCat);
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
            
            console.log("Category updated successfully:", updatedCategory);
            return updatedCategory ? [updatedCategory] : null;
        } catch (error) {
            console.error("Error updating category:", error);
            return null;
        }
       
    }

    async deleteCatData(id: any): Promise<boolean> {
        const catData = await prisma.category.delete({
            where:{
                id:id
            }
        })
        console.log("cat" , catData);
        return true
    }

    async  blockUser(id: any): Promise<User | null> {
        const userData = await prisma.user.update({
            where:{
                id:id
            },
            data:{
                isBlocked:true
            }
        })
        console.log("userData",userData);
        if(userData) {
            return userData
        }

        return null
        
    }

    async getInstructorId(id: any): Promise<Instructor | null> {
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

     async updateInstructorApprovel(id:any): Promise<Instructor | null> {
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

    async cancelApprovel(id: any): Promise<Instructor | null> {
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


    async getUserId(id: any): Promise<User | null> {
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
                id: true, // Select instructor's id
                name: true, // Select instructor's name
                wallet: {
                  select: {
                    id: true, // Select wallet id
                    balance: true, // Select wallet's balance (if applicable)
                    transactions: {
                      select: {
                        id: true, // Select transaction id
                        amount: true, // Select transaction amount
                        createdAt: true, // Select the creation date of the transaction
                      },
                    },
                  },
                },
              },
        });
        console.log("dee" , details)
       

        return details
    }
}

export default adminRepository;