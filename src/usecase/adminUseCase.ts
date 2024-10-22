import IadminRepository from "../interface/repository/IadminRepository";
import IhashPassword from "../interface/services/IhashPassword";

class adminUseCase {
    constructor(
        private hashPassword:IhashPassword,
        private adminRepository:IadminRepository
    ){}

    async insertAdmin(email:string , password:string) {
        const hashedPassword = await this.hashPassword.hash(password);
        const admin = this.adminRepository.insert(email , hashedPassword);
    }
    async verifyLogin(email:string , adminPassword:string) {
        const admin = await this.adminRepository.findByEmail(email);
        if(admin) {
            const password = await this.hashPassword.compare(adminPassword , admin.password)
            if(password) {
                return {success:true , message:"admin matched succesfully"};
            }else{
                return {success:false , message:"Invalid password"};
            }

        }else{
            return {success:false , message:"Invalid Email"};
        }
    }
}

export default adminUseCase;