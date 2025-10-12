import { injectable } from "inversify";
import Admin from "../../entity/Admin";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import User from "../../entity/User";
import IadminRepository from "../../interface/repository/IadminRepository";
import { GenericRepository } from "./GenericRepository";
import prisma from "../service/prismaClient";
import { TransactionSummaryResponse } from "../../entity/Transaction";
import { Ticket } from "../../entity/Ticket";


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
    
    async getInstructor(): Promise<{topInstructors: Instructor[]; totalInstructorCount: number; revenueSummary: { totalCourses: number; totalEnrollments: number; totalRevenue: number }}> {
        const instructors = await prisma.instructor.findMany({
            include: {
              courseBundles: {
                include: {
                  enrollments: true,
                },
              },
            },
          });
          const totalInstructorCount = instructors.length;
          let totalCourses = 0;
          let totalEnrollments = 0;
          let totalRevenue = 0;
        
          instructors.forEach((inst) => {
            totalCourses += inst.courseBundles.length;
            inst.courseBundles.forEach((course) => {
              totalEnrollments += course.enrollments.length;
              totalRevenue += course.price * course.enrollments.length;
            });
          });

          const topInstructors = [...instructors]
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 5);
        
          return {
            topInstructors,
            totalInstructorCount,
            revenueSummary: {
              totalCourses,
              totalEnrollments,
              totalRevenue,
            },
          };


    }

    async createCategory(name:string): Promise<Category | null> {
      const existingCat = await prisma.category.findFirst({
        where: {
          catName: {
            equals: name,
            mode: "insensitive", 
          },
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
      const existingCat = await prisma.category.findFirst({
        where: {
          catName: {
            equals: name,
            mode: "insensitive", 
          },
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

    async getTransactionDetails(search:string|"" , page:number , limit:number,start:string  | "" , end:string|""): Promise<TransactionSummaryResponse> {
        const skip = (page - 1) * limit;
        
        const transactionDateFilter: any = {};
        if (start && !isNaN(new Date(start).getTime())) {
          transactionDateFilter.gte = new Date(start);
        }
        if (end && !isNaN(new Date(end).getTime())) {
          const endDate = new Date(end);
          if (end.length === 10) {
            endDate.setHours(23, 59, 59, 999);
          }
          transactionDateFilter.lte = endDate;
        }

const instructorWhereBase: any = search
  ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }
  : {};

if (Object.keys(transactionDateFilter).length > 0) {
  instructorWhereBase.wallet = {
    transactions: {
      some: {
        createdAt: transactionDateFilter,
      },
    },
  };
}

const instructors = await prisma.instructor.findMany({
  where: instructorWhereBase,
  skip,
  take: limit,
  select: {
    id: true,
    name: true,
    email: true,
    wallet: {
      select: {
        transactions: {
          where: Object.keys(transactionDateFilter).length ? { createdAt: transactionDateFilter } : {},
          select: { amount: true, createdAt: true },
        },
      },
    },
  },
});

        
const data = instructors.map((instructor) => {
  const totalEarnings =
    instructor.wallet?.transactions.reduce((sum, t) => sum + t.amount, 0) || 0;

  const adminEarnings = totalEarnings * 0.15;

  return {
    instructorId: instructor.id,
    instructorEmail: instructor.email,
    instructorName: instructor.name,
    totalEarnings,
    adminEarnings,
  };
});


const total = await prisma.instructor.count({
  where: instructorWhereBase,
});
        
          return { total, data };
    }

    async approveInstrcutors(): Promise<Instructor[]> {
        const pendingInstructors = await prisma.instructor.findMany({
            where: {
              isApproved: false,
            },
            orderBy: {
              id: "desc",
            },
          });
    
          return pendingInstructors;
    }

    async getMonthlyRevenue(): Promise<{ month: string; amount: number; }[]> {
        const transactions = await prisma.transaction.findMany({
            where: {
              type: "credit", // assuming only credit transactions count as revenue
            },
            select: {
              amount: true,
              createdAt: true,

            },
          });
        
          const revenueMap: Record<string, number> = {};
        
          transactions.forEach((tx) => {
            const month = tx.createdAt.toLocaleString("default", { month: "short" }); // "Jan", "Feb", etc.
            if (!revenueMap[month]) revenueMap[month] = 0;
            revenueMap[month] += tx.amount;
          });
        
          
          const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
          const monthlyRevenue = monthOrder.map((m) => ({
            month: m,
            amount: revenueMap[m] || 0,
          }));
        
          return monthlyRevenue;
    }

    async getAllTickets(search: string | "", page: number, limit: number): Promise<{ tickets: Ticket[]; totalCount: number } | null> {
      const skip = (page - 1) * limit;

      

      const tickets = await prisma.ticket.findMany({
        where: search
          ? {
              OR: [
                { user: { name: { contains: search, mode: "insensitive" } } },
                { instructor: { name: { contains: search, mode: "insensitive" } } },
                { course: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {},
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          description: true,
          attachments: true,
          status: true,
          adminRemarks: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          instructor: {
            select: {
              id: true,
              name: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      const totalCount = await prisma.ticket.count({
        where:search
        ? {
            OR: [
              { user: { name: { contains: search, mode: "insensitive" } } },
              { instructor: { name: { contains: search, mode: "insensitive" } } },
              { course: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {},
      });

      const mappedTickets = tickets.map((t) => ({
        id: t.id,
        userId: t.user.id,
        userName: t.user.name,
        userEmail: t.user.email,
        instructorId: t.instructor?.id,
        instructorName: t.instructor?.name,
        courseId: t.course?.id,
        courseName: t.course?.name,
        description: t.description,
        attachments: t.attachments,
        status: t.status,
        adminRemarks: t.adminRemarks,
        createdAt: t.createdAt,
      }));
    
      return { tickets: mappedTickets, totalCount };
      
    }

    async updateTicketById(status: string, ticketId: string): Promise<boolean> {
    
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: status },
      });
    
      return true;
    }

    async getAllInstructor(): Promise<Instructor[] | null> {
        const data = await prisma.instructor.findMany();
        return data
    }
}
