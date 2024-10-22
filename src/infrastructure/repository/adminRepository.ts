import Admin from "../../entity/Admin";
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
    
}

export default adminRepository;