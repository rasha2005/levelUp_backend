import IadminRepository from "../interface/repository/IadminRepository";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";

class adminUseCase {
    constructor(
        private _hashPassword:IhashPassword,
        private _adminRepository:IadminRepository,
        private _jwt:Ijwt,
        private _email:IsendEmailOtp
    ){}

    async insertAdmin(email:string , password:string) {
        const hashedPassword = await this._hashPassword.hash(password);
        const admin = this._adminRepository.insert(email , hashedPassword);
    }
    async verifyLogin(email:string , adminPassword:string) {
       
            const admin = await this._adminRepository.findByEmail(email);
        if(admin) {
            const password = await this._hashPassword.compare(adminPassword , admin.password);
            const token = this._jwt.authToken(admin.id ,admin.email , "Admin");
            if(password) {
                return {success:true , message:"admin matched succesfully" , token};
            }else{
                return {success:false , message:"Invalid password"};
            }

        }else{
            return {success:false , message:"Invalid Email"};
        }
    
    }
    async getUsers() {
      
        const userData = await this._adminRepository.getUser();
        if(userData) {
            return {success:true , userData}
        }else{
            return {success:false , message:"no user found"}
        }
    
    }

    async getInstructors() {
      
         const instructorData = await this._adminRepository.getInstructor();
        if (instructorData) {
            return {success:true , instructorData}
        }else{
            return {success:false , message:"no instructor found"}
        }
    
    }

    async createCat(data:string) {
       
         const categoryData = await this._adminRepository.createCategory(data);
        if(categoryData) {
            return {success:true , categoryData};
        }else{
            return {success:false , message:"category already exists"};
        }
    
    }

    async getCatData() {
        
     
          const category = await this._adminRepository.getCatData();
        if(category) {
            return {success:true , category};
        }else{
            return {success:false , message:"category not found"};
        }
   
    }

    async editCatData(name:string , id:any) {
    
        const category = await this._adminRepository.editCatData(name , id);
       
        if(category) {
            return {success:true , category};
        }else{
            return {success:false , message:"category already exists"};
        }
  
    }

    async deleteCatData(id:any) {
      
        const category = await this._adminRepository.deleteCatData( id);
        
        if(category) {
            return {success:true,message:"category deleted successfully"};
        }else{
            return {success:false , message:"something went wrong"};
        }
    
    }

    async blockUserId(id:any) {
   
        const user = await this._adminRepository.blockUser(id);
        if(user) {
            return {success:true,message:"user blocked successfully" ,user}
        }else{
            return {success:false , message:"something went wrong"};
        }
    
    }

    async getInstructorDetaild(id:any) {
        const instructor = await this._adminRepository.getInstructorId(id);
        if(instructor) {
            return {success:true , message:"instructor found successfully" , instructor};
        }else{
            return {success:false , message:"instructor not found"};
        }
    }

    async instructorApprovel(id:any) {
        const instructor = await this._adminRepository.updateInstructorApprovel(id);
        if(instructor) {
            return {success:true , message:"approved successfully"}
        }else{
            return {success:false , message:"something went wrong!"};
        }
    }
    async instructorApprovelCancel(id:any) {
        const instructor = await this._adminRepository.cancelApprovel(id);
        if(instructor) {
            return {success:true , message:"approval cancelled successfully"}
        }else{
            return {success:false , message:"something went wrong!"};
        }
    }

    async getUserDetaild(id:any) {
        const instructor = await this._adminRepository.getUserId(id);
        if(instructor) {
            return {success:true , message:"instructor found successfully" , instructor};
        }else{
            return {success:false , message:"instructor not found"};
        }
    }

    async reminder() {
        const date = new Date();
        
        const user = await this._adminRepository.findSlotsByDate(date);
        
        if(user){
            for(let i of user){
                
                await this._email.sendReminder(i.user?.email , i.user?.name)
            }
        }
    }

    async fetchDetail() {
        const wallet = await this._adminRepository.findWallet();
        if(wallet){
            return {success:true  , wallet};
        }else{
            return {success:false };
        }
    }

    async getTransaction() {
        const transaction = await this._adminRepository.getTransactionDetails();
        if(transaction){
            return {success:true  , transaction};
        }else{
            return {success:false };
        }
    }
}

export default adminUseCase;