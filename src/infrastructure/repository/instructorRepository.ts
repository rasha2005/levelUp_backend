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
import QuestionBundle from "../../entity/Bundle";
import Question from "../../entity/Question";
import CourseBundle from "../../entity/CourseBundle";
import ICourseBundle from "../../interface/entity/ICourseBundle";

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

    async updateInstructorDetials(email:string ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string , specialization:string[]): Promise<Instructor | null> {
        const existing = await prisma.instructor.findUnique({
            where: { email },
            select: { specializations: true }
          });
        
          // 2️⃣ Build update payload for always-updated fields
          const updateData: any = {
            category: experienceCategory,
            description,
            experience: experienceCertificate,
            resume
          };
        
          // 3️⃣ If specialization array is not empty → merge with existing
          if (specialization && specialization.length > 0) {
            const current = existing?.specializations ?? [];
            updateData.specializations = [...current, ...specialization];
          }
        
          // 4️⃣ Update instructor
          const updatedData = await prisma.instructor.update({
            where: { email },
            data: updateData
          });
        
          console.log("updatedData", updatedData);
          return updatedData ?? null;
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
                instructorId:id,
                userId:{not:null}
                
            },
            include:{user:true},
            orderBy: {
                createdAt: "desc", 
              },
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
    async updateInstructorJoin(roomId : string):Promise<boolean> {
        const data = await prisma.slot.updateMany({
            where:{
                roomId:roomId
            },
            data: { hasInstructorJoined: true },
        })
        if(data) return true;
        return false;
    }

    async createQuestionBundle(instructorId: string, bundleName: string): Promise<boolean> {
        const bundle = await prisma.questionBundle.create({
            data: {
              instructorId,
              bundleName,
            },
          });
          if(bundle) return true
          return false;
    }

    async getBundleData(instructorId: string): Promise<QuestionBundle[] | null> {
        const bundle = await prisma.questionBundle.findMany({
            where: { instructorId },
            include: { questions: true },
            orderBy: {
                createdAt: "desc", 
              },
            
        })

        if(bundle) return bundle
        return null
    }

    async createQuestion(questionText:string , type:string , options:string[], answer:string , bundleId: string): Promise<Question | null> {
        
        const question = await prisma.question.create({
            data: { 
              bundleId,   
              text: questionText,
              type,
              options,
              answer
            },
          });
        
          await prisma.questionBundle.update({
            where:{
                id:bundleId
            },
            data:{
                questionsCount:{increment:1}
            }
          })
         if(question) return question;
        return null
    }

    async getQuestions(bundleId: string): Promise<Question[] | null> {
        const data = await prisma.question.findMany({
            where:{
                bundleId
            }
        })
        if(data) return data
        return null
    }

    async createTest(activeSlotId: string,  selectedQuestions: string[]): Promise<boolean> {
        const test = await prisma.test.create({
            data:{
                slotId:activeSlotId,
                questions:selectedQuestions,
                
            }
        })
        
        if(test){
           await prisma.slot.update({
                where: { id: activeSlotId },
                data: { hasTest: true },
              })
             

              return true
        }
        return false
    }

    async deleteQuestion(id: string): Promise<boolean> {
        const data = await prisma.question.findFirst({
            where:{
                id
            }
        })
        const bundleId = data?.bundleId
        await prisma.questionBundle.update({
            where:{
                id:bundleId
            },
            data:{
                questionsCount:{decrement:1}
            }
        })
        await prisma.question.delete({
          where:{
            id:id,

          }
        })


        return true
    }

   async deleteBundle(id: string): Promise<boolean> {
        await prisma.question.deleteMany({
            where:{
                bundleId:id
            }
        })
        await prisma.questionBundle.delete({
            where:{
                id
            }
        })
        return true;
    }

    async updateBundle(name:string , id: string): Promise<boolean> {
        await prisma.questionBundle.update({
            where:{
                id
            },
            data:{
                bundleName:name
            }
        })
        return true
    }

    async courseBundle(data: ICourseBundle , token:string): Promise<CourseBundle | undefined> {
        try{
console.log("token",token)
            const {
            name,
            thumbnail,
            description,
            price,
            participantLimit,
            startDate,
            endDate,
            isFreeTrial,
            } = data;
            const startDateObj = new Date(startDate + "T00:00:00"); 
            const endDateObj = new Date(endDate + "T23:59:59"); //
            const course = await prisma.courseBundle.create({
                data: {
                    name,
                    thumbnail,
                    description,
                    price,
                    participantLimit,
                    startDate:startDateObj,
                    endDate:endDateObj,
                    isFreeTrial,
                    instructorId:token
                  },
            })
            return course

           
        }catch(err){
            console.log(err);
        }
    }

    async getCourseBundle(instructorId: string): Promise<CourseBundle[] | null> {
        const data = await prisma.courseBundle.findMany({
            where:{
                instructorId
            }
        })
        if(data)return data
        return null
    }

    async courseSlots(title: string, date: string, startTime: string, endTime: string, bundleId: string, instructorId: string , roomId:string): Promise<Slot | null> {
        
        const startDateTime = new Date(`${date}T${startTime}:00`);
        const endDateTime = new Date(`${date}T${endTime}:00`);

        await prisma.courseBundle.update({
            where:{
                id:bundleId
            },
            data:{
                sessionCount:{increment:1}
            }
        })
       
        const data = await prisma.slot.create({
            data:{
                title,
                startTime:startDateTime,
                endTime:endDateTime,
                roomId,
                instructorId,
                courseBundleId:bundleId,
                isCourse:true
            }
        })
        return data
    }

    async getCourseSlots(bundleId: string): Promise<Slot[] | null> {
        const data = await prisma.slot.findMany({
            where:{
                courseBundleId:bundleId
            }
        })
        console.log('eh',data)
        return data
    }

    async bundleStatus(bundleId: string): Promise<boolean> {
        const data = await prisma.courseBundle.update({
            where:{
                id:bundleId
            },
            data:{
                status:"published"
            }
        })
        if(data)return true
        return false 
    }
}

