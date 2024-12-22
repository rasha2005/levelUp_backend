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
       try{
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
    }catch(err:any){
        throw(err)
    }
    
    }
    async getUsers() {
      try{
        const userData = await this._adminRepository.getUser();
        if(userData) {
            return {success:true , userData}
        }else{
            return {success:false , message:"no user found"}
        }
      }catch(err:any){
        throw(err)
      }
    }

    async getInstructors() {
      try{
         const instructorData = await this._adminRepository.getInstructor();
        if (instructorData) {
            return {success:true , instructorData}
        }else{
            return {success:false , message:"no instructor found"}
        }
    }catch(err:any){
        throw(err)
    }
    
    }

    async createCat(data:string) {
       try{
         const categoryData = await this._adminRepository.createCategory(data);
        if(categoryData) {
            return {success:true , categoryData};
        }else{
            return {success:false , message:"category already exists"};
        }
    }catch(err:any){
        throw(err)
    }
    
    }

    async getCatData() {
        try{
          const category = await this._adminRepository.getCatData();
        if(category) {
            return {success:true , category};
        }else{
            return {success:false , message:"category not found"};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async editCatData(name:string , id:any) {
        try{
        const category = await this._adminRepository.editCatData(name , id);
       
        if(category) {
            return {success:true , category};
        }else{
            return {success:false , message:"category already exists"};
        }
    }catch(err:any){
        throw(err)
    }
  
    }

    async deleteCatData(id:any) {
      try{
        const category = await this._adminRepository.deleteCatData( id);
        
        if(category) {
            return {success:true,message:"category deleted successfully"};
        }else{
            return {success:false , message:"something went wrong"};
        }
    }catch(err:any){
        throw(err)
    }
    
    }

    async blockUserId(id:any) {
        try{
        const user = await this._adminRepository.blockUser(id);
        if(user) {
            return {success:true,message:"user blocked successfully" ,user}
        }else{
            return {success:false , message:"something went wrong"};
        }
    }catch(err:any){
        throw(err)
    }
    
    }

    async getInstructorDetaild(id:any) {
        try{
        const instructor = await this._adminRepository.getInstructorId(id);
        if(instructor) {
            return {success:true , message:"instructor found successfully" , instructor};
        }else{
            return {success:false , message:"instructor not found"};
        }
    }catch(err:any){
        throw(err);
    }
    }

    async instructorApprovel(id:any) {
        try{
        const instructor = await this._adminRepository.updateInstructorApprovel(id);
        if(instructor) {
            return {success:true , message:"approved successfully"}
        }else{
            return {success:false , message:"something went wrong!"};
        }
    }catch(err:any){
        throw(err)
    }
    }
    async instructorApprovelCancel(id:any) {
        try{
        const instructor = await this._adminRepository.cancelApprovel(id);
        if(instructor) {
            return {success:true , message:"approval cancelled successfully"}
        }else{
            return {success:false , message:"something went wrong!"};
        }
    }catch(err:any){
        throw(err);
    }
    }

    async getUserDetaild(id:any) {
        try{
        const instructor = await this._adminRepository.getUserId(id);
        if(instructor) {
            return {success:true , message:"instructor found successfully" , instructor};
        }else{
            return {success:false , message:"instructor not found"};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async reminder() {
        try{
        const date = new Date();
        
        const user = await this._adminRepository.findSlotsByDate(date);
        
        if(user){
            for(let i of user){
                
                await this._email.sendReminder(i.user?.email , i.user?.name)
            }
        }
    }catch(err:any){
        throw(err)
    }
    }

    async fetchDetail() {
        try{
        const wallet = await this._adminRepository.findWallet();
        if(wallet){
            return {success:true  , wallet};
        }else{
            return {success:false };
        }
    }catch(err:any){
        throw(err)
    }
    }

    async getTransaction() {
        try{
        const transaction = await this._adminRepository.getTransactionDetails();
        if(transaction){
            return {success:true  , transaction};
        }else{
            return {success:false };
        }
    }catch(err:any){
        throw(err)
    }
    }
}

export default adminUseCase;