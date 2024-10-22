import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";
import IinstructorRepository from "../../interface/repository/IinstructorRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class instructorRepository implements IinstructorRepository {
    constructor() {}

    async findByEmail(email: string): Promise<Instructor | null> {

        const instructor = await prisma.instructor.findUnique({
            where:{email}
        })

        return instructor;
    }

    async saveOtp(email:string , instructorOtp:string): Promise<Otp | null> {
        
        const InstructorOtp = await prisma.otp.create({
            data: {
              email: email,
              otp: instructorOtp,
            },
          });
          console.log("repo" , InstructorOtp)
          return InstructorOtp;
    }

    async findOtpByEmail(email: string): Promise<Otp | null> {
        const otp = await prisma.otp.findUnique({
            where:{email}
        })
        return otp;
    }

    async insertInstructor(insructor: Instructor , hashedPassword:string): Promise<Instructor | null> {
        console.log("keee")
        const {name , email , mobile } = insructor;
        const savedInstructor = await prisma.instructor.create({
            data:{
             name:name,
             email:email,
             mobile:mobile,
             password:hashedPassword
            }
     
           })

           console.log("savedInstructor",savedInstructor);
           return savedInstructor
    }
}

export default instructorRepository