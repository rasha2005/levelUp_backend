import { injectable } from "inversify";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Otp from "../../entity/Otp";
import { Session } from "../../entity/Session";
import Slot from "../../entity/Slot";
import User from "../../entity/User";
import { Wallet } from "../../entity/Wallet";
import IinstructorRepository from "../../interface/repository/IinstructorRepository";
import { PrismaClient } from "@prisma/client";
import { GenericRepository } from "./GenericRepository";

const prisma = new PrismaClient();

@injectable()
export class InstructorRepository extends GenericRepository<Instructor> implements IinstructorRepository {
    constructor() {
        super(prisma, prisma.instructor);
      }

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
          return InstructorOtp;
    }

    async findOtpByEmail(email: string): Promise<Otp | null> {
        const otp = await prisma.otp.findUnique({
            where:{email}
        })
        return otp;
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

    async insertInstructor(insructor: Instructor , hashedPassword:string): Promise<any> {
        const {name , email , mobile } = insructor;
        const savedInstructor = await prisma.instructor.create({
            data:{
             name:name,
             email:email,
             mobile:mobile,
             password:hashedPassword
            }
     
           })

           return savedInstructor
    }

    async getCategoryList(): Promise<Category[] | null> {
        const catDaata = await prisma.category.findMany();
        if(catDaata) {
            return catDaata
        }
        return null
    }

    async updateInstructorDetials(email:string ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string): Promise<Instructor | null> {
        const updatedData = await prisma.instructor.update({
            where:{
                email:email
            },
            data:{
                category:experienceCategory,
                description:description,
                experience:experienceCertificate,
                resume:resume
            }
        });
        if(updatedData) {
            return updatedData
        }
        return null
    }

    async getInstructorByEmail(email: string): Promise<Instructor | null> {
        const data = await prisma.instructor.findUnique({
            where:{
                email:email
            }
        })
        if(data) {
            return data
        }
        return null
    }

    async editInstructorByEmail(email: string, name: string, mobile: string): Promise<Instructor | null> {

        const data = await prisma.instructor.update({
            where:{
                email:email
            },
            data:{
                name:name,
                mobile:mobile
            }
        })
        if(data) {
            return data
        }
        return null
    }

    async updateProfileByEmail(email: string, img: string): Promise<Instructor | null> {
        if(img) {

            const data = await prisma.instructor.update({
                where:{
                    email:email
                },
                data:{
                  img:img
                }
            })
            if(data) {
                return data
            }
        }else{
            const data = await prisma.instructor.findUnique({
                where:{
                    email:email
                }
            })
            if(data) {
                return data
            }
        }
        return null
    }

    async changePassword(email: string, password: string): Promise<Instructor | null> {
        const instructor = await prisma.instructor.update({
            where:{
                email:email
            },
            data:{
                password:password
            }
        })
        if(instructor) {
            return instructor;
        }
        return null;
    }

    async scheduleSession(id: string, title: string, start: string, end: string, price: string): Promise<Session | null> {
        const existingSession = await prisma.scheduledSession.findUnique({
            where:{
                instructorId:id
            }
        })
      
        if(existingSession) {
            const updatedSession = await prisma.scheduledSession.update({
                where: { id: existingSession.id },
                data:{
                    events:{
                        create:{
                            title:title,
                            start:start,
                            end:end,
                            price:price
                        }
                    }
                },
                include: { events: true },
            })
            return updatedSession as Session;

        }else{
            const createdSession = await prisma.scheduledSession.create({
                data:{
                    instructorId:id,
                    events: {
                        create: {
                            title:title,
                            start:start,
                            end:end,
                            price:price
                        }
                    }
                },
                include: { events: true },
            })
            return createdSession as Session;
        }

        return null
    }

    async getEventsById(id: string): Promise<Session | null> {
        const events = await prisma.scheduledSession.findUnique({
            where:{
                instructorId:id
            },
            include:{events:true}
        })
        if(events) {
            return events
        }
        return null
    }

    async deleteEventById(id: string, instructorId: string): Promise<boolean> {

        await prisma.event.delete({
            where: { id },
        });
        return true;
    }

    async getSlotList(id:string): Promise<Slot[] | null> {

      
        const slotList = await prisma.slot.findMany({
            where:{
                instructorId:id
                
            },
            include:{user:true}
        })
        if(slotList){
            return slotList
        }
        return null
    }
    
    async findWallet(token: string): Promise<Wallet | null> {
        const wallet = await prisma.wallet.findUnique({
            where:{
              instructorId:token
            },
            include: {transactions:true},
          })

         if(wallet) {
          return wallet
          }
         

         return null
    }

    async getImgById(id: string): Promise<string | null> {
        const data = await prisma.instructor.findUnique({
            where:{
                id:id
            }
        })
        if(data){
            return data.img
        }
        return null
    }

    async verifyRoomById(roomId: string): Promise<Slot | null> {
        const data = await prisma.slot.findFirst({
            where:{
                roomId:roomId
            }
        })
        if(data) {
            return data
        }

        return null
    }
}

