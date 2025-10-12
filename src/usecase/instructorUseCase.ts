import { inject, injectable } from "inversify";
import Instructor from "../entity/Instructor";
import DecodedToken from "../entity/Token";
import IinstructorRepository from "../interface/repository/IinstructorRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";
import { InstructorDTO } from "./dtos/InstructorDTO";
import { StatusCode } from "../enums/statuscode";
import { Messages } from "../enums/message";
import { UserDTO } from "./dtos/UserDTO";
import ICourseBundle from "../interface/entity/ICourseBundle";
import { v4 as uuidv4 } from "uuid";


@injectable()
export class InstructorUseCase {
    constructor(
       @inject("IinstructorRepository") private _instructorRespository:IinstructorRepository,
       @inject("IgenerateOtp") private _generateOtp: IgenerateOtp,
       @inject("IsendEmailOtp") private _sendEmailOtp: IsendEmailOtp,
       @inject("Ijwt") private _jwt: Ijwt,
       @inject("IhashPassword") private _hashPassword: IhashPassword,
    ){}

    async findInstructor(instructor: Instructor) {
        try {
          const { email } = instructor;
      
          const existingInstructor = await this._instructorRespository.findByEmail(email);
      
          if (existingInstructor) {
            return {
              status: StatusCode.OK,
              success: false,
              message: Messages.FOUND,
            };
          }
      
          const otp = this._generateOtp.createOtp();
      
          await this._sendEmailOtp.sendEmail(email, otp);
          const instructorOtp = await this._instructorRespository.saveOtp(email, otp);
      
          const token = this._jwt.otpToken(instructor);
      
          return {
            status: StatusCode.OK,
            success: true,
            message: Messages.FETCHED,
            instructorOtp,
            token,
          };
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
      

    async saveInstructor(instructorOtp:string , token:string) {
        try{
       
         const decodedToken = this._jwt.verifyToken(token);
        
        const otp = await this._instructorRespository.findOtpByEmail(decodedToken?.info.email);
        
        const hashedPassword = await this._hashPassword.hash(decodedToken?.info.password);
        
       
        if(otp?.otp == instructorOtp) {
            
            const instructor = await this._instructorRespository.insertInstructor(decodedToken?.info , hashedPassword);
            if(instructor) {
                const authToken = this._jwt.authToken(instructor.id , instructor.email , "Instructor");
                const refreshToken = this._jwt.refreshToken(instructor.id , instructor.email , "Instructor");

               
                return {success:true , message:Messages.CREATED ,authToken:authToken , refreshToken};
            }
        }
        return {success:false , message:Messages.INVALID};
    }catch(err:any) {
        throw(err)
    }

    }

    async verifyLogin(email:string , instructorpassword:string) {
      try{
         const instructor = await this._instructorRespository.findByEmail(email);
        if(instructor && instructor.password) {
            const password = await this._hashPassword.compare(instructorpassword , instructor.password);
            const token = this._jwt.authToken( instructor.id , instructor.email , "Instructor")
            const refreshToken = this._jwt.refreshToken( instructor.id , instructor.email , "Instructor")
            if(password) {
                
                return {success:true , message:Messages.FETCHED , authToken:token , refreshToken};

            }else{
                return {success:false , message:Messages.INVALID};
            }

        }else{
            return {success:false , message:Messages.INVALID};
        }
      }catch(err:any) {
        throw(err)
      }
    }

    async getCataData() {
        try{
        const res = await this._instructorRespository.getCategoryList();
       
        if(res) {
            return {success:true , message:Messages.FETCHED, res}
        }else{
            return {success:false , message:Messages.FAILED};
        }
    }catch(err:any) {
        throw(err)
    }
    }

    async updateInstructor(token:DecodedToken ,description:string , experienceCategory:string ,experienceCertificate:string , resume:string , specialization:string[]) {
        try{
        if(token){
            
            const res = await this._instructorRespository.updateInstructorDetials(token.email ,description , experienceCategory ,experienceCertificate , resume , specialization);
            if(res) {
                return {success:true , message:Messages.UPDATED , res}
            }else{
                return {success:false , message:Messages.FAILED};
            }
        }
    }catch(err:any){
        throw(err)
    }
    }

    async getInstructorDetails(token:DecodedToken) {
        try{
        

            if(token){
                const res = await this._instructorRespository.getInstructorByEmail(token.email );
                if(res) {
                    const instructorDto = InstructorDTO.fromEntity(res)
                    return {success:true , message:Messages.FETCHED , res:instructorDto}
                }else{
                    return {success:false ,message:Messages.FAILED};
                }
            }
        }catch(err:any){
            throw(err)
        }
    }

    async editInstructorDetails(token:DecodedToken , name:string , mobile:string) {
        try{

        if(token){
            const res = await this._instructorRespository.editInstructorByEmail(token.email ,name , mobile);
            if(res) {
                const instructorDto = InstructorDTO.fromEntity(res)
                return {success:true , message:Messages.UPDATED , res:instructorDto}
            }else{
                return {success:false , message:Messages.FAILED};
            }

    }
}catch(err:any){
        throw(err)
    }
}

    async updateImg(token:DecodedToken , img:string ) {
        try{

        if(token){
            const res = await this._instructorRespository.updateProfileByEmail(token.email ,img);
            if(res) {
                const instructorDto = InstructorDTO.fromEntity(res)
                return {success:true , message:Messages.UPDATED , res:instructorDto}
            }else{
                return {success:false , message:Messages.FAILED};
            }

    }
        }catch(err:any){
            throw(err);
        }
}

async resendOtpByEmail(token:string) {
    try{
    const decodedToken = this._jwt.verifyToken(token);
   
    if(decodedToken) {
        const otp = this._generateOtp.createOtp();
        
        await this._sendEmailOtp.sendEmail(decodedToken.info.email , otp);
        const otpData = await this._instructorRespository.findOtpByEmail(decodedToken.info.email);
        if(otpData) {
            const updatedOtp = await this._instructorRespository.updateOtpByEmail(decodedToken.info.email , otp);
            
            return {success:true , message:"otp resend successfully" , updatedOtp};
        }else{
            const savedOtp = await this._instructorRespository.saveOtp(decodedToken.info , otp);
            
            return {success:true , message:"otp resend successfully" , savedOtp};
        }
       
    }
    return {success:false , message:Messages.FAILED};
        }catch(err:any){
            throw(err)
        }
}


  async changeInstructorPassword(token:DecodedToken , current:string , confirm:string) {
    try{
    
    if(token) {
        const instructor = await this._instructorRespository.findByEmail(token.email);
        if(instructor && instructor.password) {
            const isPasswordMatched = await this._hashPassword.compare(current , instructor?.password);
            if(isPasswordMatched) {
                const hashedPassword = await this._hashPassword.hash(confirm);
                const updatedInstructor = await this._instructorRespository.changePassword(token.email , hashedPassword); 
                if(updatedInstructor) {
                    const instructorDto = InstructorDTO.fromEntity(updatedInstructor)
                    return {success:true , message:'password updated successfully' , updatedInstructor:instructorDto};
                }else{
                    return{success:false , message:Messages.FAILED}
                }
            }else{
                return {success:false , message:'Incorrect password'}
            }
        }else{
            return {success:false , message:Messages.FAILED};
        }
    }
    }catch(err:any){
        throw(err)
    }
}

    async scheduleSessionById(title:string , start:string , end:string , price: string , token:DecodedToken ,isRecurring:boolean , recurrenceRule:string |null) {
        try{
   
    console.log("recurrenceRule",recurrenceRule)
    if(token) {
        const session = await this._instructorRespository.scheduleSession(token.id , title , start , end , price , isRecurring , recurrenceRule);
        
        if(session) {
            return {success:true , message:Messages.UPDATED , session};
        }else{
            return {success:false ,message:Messages.FAILED};
        }
    }else{
        return {success:true , message:Messages.FAILED};
    }
    }catch(err:any){
        throw(err)
    }
    
}

    async getEventsData(token:DecodedToken) {
        try{
        
        const instructor = await this._instructorRespository.getInstructorByEmail(token?.email)
        const instructorDto = InstructorDTO.fromEntity(instructor!)
        if(token) {
            const events = await this._instructorRespository.getEventsById(token.id);
            console.log("ins",events);
            return {success:true , message:Messages.FOUND , events , instructor:instructorDto };
        }else{
            return {success:false , message:Messages.FAILED};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async deleteEventData(id:string , token:DecodedToken) {
        try{
        if(token) {
            const isDeleted = await this._instructorRespository.deleteEventById(id , token.id);
            if(isDeleted) {
                return {success:true , message:Messages.DELETED};
            }else{
                return {success:false ,  message:Messages.FAILED}
            }
        }else{
            return {success:false ,  message:Messages.FAILED}
        }
    }catch(err:any){
        throw(err)
    }
    }
    async getSlots(token:DecodedToken) {
        try{
        const slot = await this._instructorRespository.getSlotList(token?.id);
        if(slot) {
            const sanitizedSlots = slot.map((slot: any) => {
                return {
                  ...slot,
                  user: UserDTO.fromEntity(slot.user) 
                };
              });
         return {success:true , message:Messages.FOUND , slot:sanitizedSlots};
        }else{
         return {success:false , message:Messages.FAILED};
        }
    }catch(err:any){
        throw(err)
    }
    }

    async getWalletDetails(token:DecodedToken ) {
        try{
        
        

        const Wallet = await this._instructorRespository.findWallet(token?.id);
        const slot = await this._instructorRespository.getSlotList(token?.id);
        
        
        if(slot) {
            return {success:true , message:Messages.FOUND , slot , Wallet}
        }else{
            return {success:false , message:Messages.FAILED}
        }
    }catch(err:any){
        throw(err)
    }
        
    }

    async getInstructorImg(token:DecodedToken) {
        try{
        const image = await this._instructorRespository.getImgById(token?.id);
        if(image) {
            return {success:true , message:Messages.FETCHED , image};
        }else{
            return {success:false , message:Messages.FAILED}
        }
    }catch(err:any){
        throw(err)
    }
    }

    async verifyroomId(roomId:string , instructorId:string) {
        try{
        const slot = await this._instructorRespository.verifyRoomById(roomId);
        if(slot?.instructorId == instructorId) {
            return {success:true}
        }else{
            return {success:false}
        }
    }catch(err:any){
        throw(err)
    }
    }

    async updateRoomJoin(roomId:string) {
        try{
            const res = await this._instructorRespository.updateInstructorJoin(roomId);
            if(res){
                return {sucess:true , message:Messages.UPDATED}
            }else{
                return {sucess:false , message:Messages.FAILED};
            }

        }catch(err) {
            throw(err);
        }
    }

    async createNewBundle(token:DecodedToken , bundleName:string){
        try{
            const data = await this._instructorRespository.createQuestionBundle(token.id , bundleName);
           
            if(data) {
                return {sucess:true , message:Messages.CREATED , res:data}
            }else{
                return {sucess:false , message:Messages.FAILED  , res:data} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async bundleData(token:DecodedToken){
        try{
            const data = await this._instructorRespository.getBundleData(token.id);
           
            if(data === false) {
                return {sucess:true , message:Messages.FETCHED , isApproved:false}
            }else{
                return {sucess:false , message:Messages.FAILED  , res:data , isApproved:true} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async createNewQuestion(questionText:string , type:string , options:string[], answer:string , bundleId:string) {
        try{
            const res = await this._instructorRespository.createQuestion(questionText , type , options, answer , bundleId);
            if(res){
                return {sucess:true , message:Messages.CREATED , data:res}
            }else{
                return {sucess:false , message:Messages.FAILED  , data:res} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async getBundleQuestions(bundleId:string) {
        try{
            const data = await this._instructorRespository.getQuestions(bundleId);
            if(data) {
                return {sucess:true , message:Messages.FETCHED , data}
            }else{
                return {sucess:false , message:Messages.FAILED  , data} ;
            }
        }catch(err){
            throw(err);
        }
    }
    async createNewTest(activeSlotId:string ,selectedBundle:string,selectedQuestions:string[]) {
        try{
            const data = await this._instructorRespository.createTest(activeSlotId,selectedQuestions);
            if(data) {
                return {sucess:true , message:Messages.CREATED , data}
            }else{
                return {sucess:false , message:Messages.FAILED  , data} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async deleteQuestionById(id:string) {
        try{
          const res = await this._instructorRespository.deleteQuestion(id)
          return {status: StatusCode.OK, success:true ,message:Messages.DELETED};

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false ,message:Messages.FAILED};
        }
      }

      async deleteBundleById(id:string) {
        try{
          const res = await this._instructorRespository.deleteBundle(id)
          return {status: StatusCode.OK, success:true };

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async updateBundleById(name:string ,id:string) {
        try{
          const res = await this._instructorRespository.updateBundle(name ,id)
          return {status: StatusCode.OK, success:true };

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async createCourseBundle(data:ICourseBundle , token:DecodedToken) {
        try{
           
          const res = await this._instructorRespository.courseBundle(data , token.id)
          if(res){

              return {status: StatusCode.OK, success:true ,message:Messages.CREATED , data:res};
          }else{
             return {sucess:false , message:Messages.FAILED } ;
          }

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async fetchCourseData(instructorId:string) {
        try{
          const data = await this._instructorRespository.getCourseBundle(instructorId)
          if(data === false) {
            return {sucess:true , message:Messages.FETCHED , isApproved:false}
        }else{
            return {sucess:false , message:Messages.FAILED  , data , isApproved:true} ;
        }

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async CreateCourseSlot(title:string , date:string,startTime:string , endTime:string,bundleId:string,instructorId:string) {
        try{
          const roomId = uuidv4();
          const res = await this._instructorRespository.courseSlots(title,date,startTime,endTime,bundleId,instructorId,roomId)
          if(res){

              return {status: StatusCode.OK, success:true ,message:Messages.CREATED , data:res};
          }else{
             return {status: StatusCode.OK,sucess:false , message:Messages.FAILED } ;
          }

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async fetchCourseSlots(bundleId:string) {
        try{
            const data = await this._instructorRespository.getCourseSlots(bundleId);
            if(data) {
                return {sucess:true , message:Messages.FETCHED , data}
            }else{
                return {sucess:false , message:Messages.FAILED  , data} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async updateBundleStatus(bundleId:string) {
        try{
            const data = await this._instructorRespository.bundleStatus(bundleId);
            if(data) {
                return {success:true , message:Messages.UPDATED}
            }else{
                return {success:false , message:Messages.FAILED} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async createCourseAnnouncement(announcementTitle:string , announcementMessages:string ,bundleId:string , insructorId:string) {
        try{
            const data = await this._instructorRespository.creareAnnouncement(announcementTitle,announcementMessages,bundleId , insructorId);
            if(data) {
                return {success:true , message:Messages.CREATED}
            }else{
                return {success:false , message:Messages.FAILED} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async deleteCourseSlotById(slotId:string) {
        try{
            const data = await this._instructorRespository.deleteCourseSlot(slotId);
            if(data) {
                return {success:true , message:Messages.DELETED}
            }else{
                return {success:false , message:Messages.FAILED} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async deleteCourseById(courseId:string) {
        try{
            const data = await this._instructorRespository.deleteCourse(courseId);
            if(data) {
                return {success:true , message:Messages.DELETED}
            }else{
                return {success:false , message:Messages.FAILED} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async updateCourseById(bundleName:string , description:string , price:number,participantLimit:number , thumbnail:string|null ,courseId:string) {
        try{
            const data = await this._instructorRespository.updateCourse(bundleName , description , price,participantLimit , thumbnail ,courseId);
            if(data) {
                return {success:true , message:Messages.UPDATED}
            }else{
                return {success:false , message:Messages.FAILED} ;
            }
        }catch(err){
            throw(err);
        }
    }

    async sendForgotPasswordOTP(email:string) {
        try{
          const instructor = await this._instructorRespository.findByEmail(email);
          if(instructor) {
            const otp = this._generateOtp.createOtp();
    
            await this._sendEmailOtp.sendEmail(instructor.email, otp)

            const instructorOtp = await this._instructorRespository.findOtpByEmail(instructor.email);
            if(instructorOtp){
            await this._instructorRespository.updateOtpByEmail(instructor.email , otp);
            }else{
            await this._instructorRespository.saveOtp(instructor.email , otp);
            }
            const instructorDTO = InstructorDTO.fromEntity(instructor);
            console.log("haha",instructorDTO)
            const token = this._jwt.otpToken(instructorDTO);
            return {
              status: StatusCode.OK,           
              success: true,
              message: `OTP ${Messages.CREATED}`,
              instructorOtp,
              token,
            };
          }
          return {
            status: StatusCode.OK,
            success: false,
            message: `Email not found`,
          };
        
        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

    async verifyPasswordOtp(userOtp:string , token:string) {
        try{
          const decodedToken = this._jwt.verifyToken(token);
    
          const otp = await this._instructorRespository.findOtpByEmail(decodedToken?.info.email);
          if(userOtp == otp?.otp) {
            return {
              status: StatusCode.OK,
              success: true,
              message: 'otp matched',
            };
          }
          return {
            status: StatusCode.OK,
            success: false,
            message: `Invalid Otp`,
          };
        
        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async changeInstructor_Password(token:string , confirm:string) {
        try {
          const decodedToken = this._jwt.verifyToken(token);
          if(decodedToken) {
            const instructor = await this._instructorRespository.findByEmail(decodedToken.info.email);
     
            if(instructor && instructor.password) {
                const hashedPassword = await this._hashPassword.hash(confirm);
                const updatedUser = await this._instructorRespository.changePassword(instructor.email ,hashedPassword);
                if(updatedUser) {
                  const userDTO = InstructorDTO.fromEntity(instructor);
                  const authToken = this._jwt.authToken(instructor.id, instructor.email, "Instructor");
                  const refreshToken = this._jwt.refreshToken(
                    instructor.id,
                    instructor.email,
                    "Instructor"
                  );
                  return {status: StatusCode.OK, success:true , message: Messages.UPDATED , updatedUser:userDTO,authToken , refreshToken};
                } else {
                  return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
                }
             
            } else {
              return {status: StatusCode.NOT_FOUND, success:false , message: Messages.FAILED};
            }
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }

      async editQuestionById(questionId:string,ansOptions:string[],answer:string,text:string ) {
        try{

            const res = await this._instructorRespository.updateQuestionByEmail(questionId,ansOptions,answer,text);
            if(res) {
                return {success:true , message:Messages.UPDATED ,}
            }else{
                return {success:false , message:Messages.FAILED};
            }

    
        }catch(err:any){
            throw(err);
        }
}
}

