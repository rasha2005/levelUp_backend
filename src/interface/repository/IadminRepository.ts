
import Admin from "../../entity/Admin";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import { Ticket } from "../../entity/Ticket";
import { TransactionSummaryResponse } from "../../entity/Transaction";
import User from "../../entity/User";


interface IadminRepository {
    insert(email:string , password:string):Promise<Admin| null>
    findByEmail(email:string):Promise<Admin | null>
    getUser():Promise<User[]| null>
    getInstructor():Promise<{topInstructors: Instructor[];  totalInstructorCount: number; revenueSummary: { totalCourses: number; totalEnrollments: number; totalRevenue: number }} >
    createCategory(data:string):Promise<Category | null>
    getCatData():Promise<Category[] | null>
    editCatData(name:string , id : string):Promise<Category[] | null>
    deleteCatData(id:string):Promise<boolean>
    blockUser(id:string):Promise<User | null>
    getInstructorId(id:string):Promise<Instructor | null>
    updateInstructorApprovel(id:string):Promise<Instructor | null >
    cancelApprovel(id:string):Promise<Instructor | null >
    getUserId(id:string):Promise<User | null>
    findSlotsByDate(date:Date):Promise<any>
    findWallet(): Promise<Admin | null>
    getTransactionDetails(search:string|"" , page:number , limit:number): Promise<TransactionSummaryResponse>
    approveInstrcutors(): Promise<Instructor[]>
    getMonthlyRevenue(): Promise<{ month: string; amount: number }[]>
    getAllTickets(search:string|"" , page:number , limit:number): Promise<{ tickets: Ticket[]; totalCount: number } | null>
    updateTicketById(status:string , ticketId:string):Promise<boolean>
    getAllInstructor(): Promise<Instructor[] | null>



}

export default IadminRepository;