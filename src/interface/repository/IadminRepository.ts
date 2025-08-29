
import Admin from "../../entity/Admin";
import Category from "../../entity/Category";
import Instructor from "../../entity/Instructor";
import Slot from "../../entity/Slot";
import User from "../../entity/User";


interface IadminRepository {
    insert(email:string , password:string):Promise<Admin| null>
    findByEmail(email:string):Promise<Admin | null>
    getUser():Promise<User[]| null>
    getInstructor():Promise<Instructor[] | null >
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
    getTransactionDetails(): Promise<Instructor[]>
}

export default IadminRepository;