import Admin from "../../entity/Admin";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import User from "../../entity/User";
import IadminRepository from "../../interface/repository/IadminRepository";
import { PrismaClient } from "@prisma/client";

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
}

export default adminRepository;