import Admin from "../../entity/Admin";

interface IadminRepository {
    insert(email:string , password:string):Promise<Admin| null>
    findByEmail(email:string):Promise<Admin | null>
}

export default IadminRepository;