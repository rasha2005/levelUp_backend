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
    editCatData(name:string , id : any):Promise<Category[] | null>
    deleteCatData(id:any):Promise<boolean>
    blockUser(id:any):Promise<User | null>
    getInstructorId(id:any):Promise<Instructor | null>
    updateInstructorApprovel(id:any):Promise<Instructor | null >
    cancelApprovel(id:any):Promise<Instructor | null >
    getUserId(id:any):Promise<User | null>
    findSlotsByDate(date:any):Promise<any>
}

export default IadminRepository;