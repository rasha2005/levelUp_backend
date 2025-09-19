import { injectable, inject } from "inversify";
import PaymentInfo from "../entity/Info";
import DecodedToken from "../entity/Token";
import User from "../entity/User";
import IuserRepository from "../interface/repository/IuserRepository";
import IgenerateOtp from "../interface/services/IgenerateOtp";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";
import Istripe from "../interface/services/Istripe";
import { InstructorDTO } from "./dtos/InstructorDTO";
import { UserDTO } from "./dtos/UserDTO";
import { Messages } from "../enums/message";
import { StatusCode } from "../enums/statuscode";

@injectable()
export class UserUseCase {
    constructor(
        @inject("IuserRepository") private _iuserRepository: IuserRepository,
        @inject("IgenerateOtp") private _generateOtp: IgenerateOtp,
        @inject("IsendEmailOtp") private _sendEmailOtp: IsendEmailOtp,
        @inject("Ijwt") private _jwtToken: Ijwt,
        @inject("IhashPassword") private _hashPassword: IhashPassword,
        @inject("Istripe") private _stripe: Istripe
    ){}

    async findUser(user: User) {
        try {
          const res = await this._iuserRepository.findByEmail(user.email);
    
          if (res) {
            return {
              status: StatusCode.OK,
              success: false,
              message: `User ${Messages.FOUND}`,
            };
          } else {
            const otp = this._generateOtp.createOtp();
    
            await this._sendEmailOtp.sendEmail(user.email, otp);
            const userOtp = await this._iuserRepository.saveOtp(user.email, otp);
            const token = this._jwtToken.otpToken(user);
    
            return {
              status: StatusCode.OK,
              success: true,
              message: `OTP ${Messages.CREATED}`,
              userOtp,
              token,
            };
          }
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
    
      async saveUser(userOtp: string, token: string) {
        try {
          const decodedToken = this._jwtToken.verifyToken(token);
    
          const otp = await this._iuserRepository.findOtp(decodedToken?.info.email);
    
          const password = decodedToken?.info.password;
          const hashedPassword = await this._hashPassword.hash(password);
    
          if (userOtp == otp?.otp) {
            const res = await this._iuserRepository.insertUser(
              decodedToken?.info,
              hashedPassword
            );
    
            const authToken = this._jwtToken.authToken(
              res.user.id,
              res.user.email,
              "User"
            );
            const refreshToken = this._jwtToken.refreshToken(
              res.user.id,
              res.user.email,
              "User"
            );
            if (res) {
              return {
                status: StatusCode.CREATED,
                success: true,
                message: `User ${Messages.CREATED}`,
                authToken,
                refreshToken,
              };
            }
          }
          return {
            status: StatusCode.BAD_REQUEST,
            success: false,
            message: Messages.INVALID,
          };
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
    
      async verifyLogin(email: string, userPassword: string) {
        try {
          const user = await this._iuserRepository.findByEmail(email);
          if (user?.isBlocked) {
            return {
              status: StatusCode.FORBIDDEN,
              success: false,
              message: "You have been blocked",
            };
          }
          if (user && user.password) {
            const password = await this._hashPassword.compare(
              userPassword,
              user.password
            );
            const token = this._jwtToken.authToken(user.id, user.email, "User");
            const refreshToken = this._jwtToken.refreshToken(
              user.id,
              user.email,
              "User"
            );
    
            if (password) {
              return {
                status: StatusCode.OK,
                success: true,
                message: Messages.AUTH_SUCCESS,
                authToken: token,
                refreshToken,
              };
            } else {
              return {
                status: StatusCode.UNAUTHORIZED,
                success: false,
                message: "Invalid password",
              };
            }
          } else {
            return {
              status: StatusCode.NOT_FOUND,
              success: false,
              message: "Invalid email",
            };
          }
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
    
      async getCateogries() {
        try {
          const category = await this._iuserRepository.getCategoryData();
          if (category) {
            return {
              status: StatusCode.OK,
              success: true,
              message: `Category ${Messages.FETCHED}`,
              category,
            };
          } else {
            return {
              status: StatusCode.INTERNAL_SERVER_ERROR,
              success: false,
              message: Messages.FAILED,
            };
          }
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
    
      async getUserDetails(token: DecodedToken) {
        try {
          const user = await this._iuserRepository.findById(token?.id);
          if (user) {
            const userDTO = UserDTO.fromEntity(user);
            return {
              status: StatusCode.OK,
              success: true,
              message: `User ${Messages.FOUND}`,
              user: userDTO,
            };
          } else {
            return {
              status: StatusCode.NOT_FOUND,
              success: false,
              message: `User ${Messages.FAILED}`,
            };
          }
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
    
      async updateUserDetails(id: string, name: string, mobile: string) {
        try {
          const user = await this._iuserRepository.editUserDetails(
            id,
            name,
            mobile
          );
          if (user) {
            const userDTO = UserDTO.fromEntity(user);
            return {
              status: StatusCode.OK,
              success: true,
              message: `User ${Messages.UPDATED}`,
              user: userDTO,
            };
          } else {
            return {
              status: StatusCode.NOT_FOUND,
              success: false,
              message: `User ${Messages.FAILED}`,
            };
          }
        } catch (err: any) {
          return {
            status: StatusCode.INTERNAL_SERVER_ERROR,
            success: false,
            message: Messages.FAILED,
          };
        }
      }
      async getInstructorDetails(page:number , limit:number , search:string | null , category :string | null) {
        try {  
          const {instructor , total} = await this._iuserRepository.getInstructor(page , limit , search , category);
          const instructorDto = instructor?.map(inst => new InstructorDTO(inst)) || [];
          return {status: StatusCode.OK, success:true , message: Messages.FOUND , instructor:instructorDto , total};
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async resendOtpByEmail(token:string) {
        try {
          const decodedToken = this._jwtToken.verifyToken(token);
         
          if(decodedToken) {
            const otp = this._generateOtp.createOtp();
            await this._sendEmailOtp.sendEmail(decodedToken.info.email , otp);
            const otpData = await this._iuserRepository.findOtp(decodedToken.info.email);
      
            if(otpData) {
              const updatedOtp = await this._iuserRepository.updateOtpByEmail(decodedToken.info.email , otp);
              return {status: StatusCode.OK, success:true , message: Messages.UPDATED , updatedOtp};
            } else {
              const savedOtp = await this._iuserRepository.saveOtp(decodedToken.info , otp);
              return {status: StatusCode.OK, success:true , message: Messages.CREATED , savedOtp};
            }
          }
          return {status: StatusCode.BAD_REQUEST, success:false , message: Messages.FAILED};
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async changeUserPassword(token:DecodedToken , current:string , confirm:string) {
        try {
          if(token) {
            const user = await this._iuserRepository.findByEmail(token.email);
            if(user && user.password) {
              const isPasswordMatched = await this._hashPassword.compare(current , user?.password);
              if(isPasswordMatched) {
                const hashedPassword = await this._hashPassword.hash(confirm);
                const updatedUser = await this._iuserRepository.changePassword(user.email ,hashedPassword);
                if(updatedUser) {
                  const userDTO = UserDTO.fromEntity(user);
                  return {status: StatusCode.OK, success:true , message: Messages.UPDATED , updatedUser:userDTO};
                } else {
                  return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
                }
              } else {
                return {status: StatusCode.UNAUTHORIZED, success:false , message: Messages.AUTH_FAILED};
              }
            } else {
              return {status: StatusCode.NOT_FOUND, success:false , message: Messages.FAILED};
            }
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async getInstructorDetail(id:string, token:DecodedToken) {
        try {
          const instructor = await this._iuserRepository.getInstructorId(id);
          if(instructor) {
            const review = await this._iuserRepository.getReviewById(id);
            const isReview = await this._iuserRepository.reviewExist(id , token?.id);
            const instructorDto = InstructorDTO.fromEntity(instructor);
            return {status: StatusCode.OK, success:true , message: Messages.FOUND , instructor:instructorDto  , review , isReview};
          } else {
            return {status: StatusCode.NOT_FOUND, success:false , message: Messages.FAILED};
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async payement(info:PaymentInfo ,token:string) {
        try {
          const decodedToken = this._jwtToken.verifyToken(token);
          const res = await this._stripe.stripePayement(info ,decodedToken?.id);
          if(res) {
            return {status: StatusCode.OK, success:true , message: Messages.CREATED , res};
          } else {
            return {status: StatusCode.BAD_REQUEST, success:false , message: Messages.FAILED};
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async successPayment(session:any) {
        try {
          const {instructorId , userId , id , price} = session.metadata;
            await this._iuserRepository.createSlot(session.metadata);
           await this._iuserRepository.updateEventStatus(id);
          const priceNumber = parseFloat(price);
          const percent = price * 0.15;
          const amount =  priceNumber - percent;
          const type = "credit";
           await this._iuserRepository.createInstructorWallet(instructorId , amount , type , percent);
          return {status: StatusCode.OK, success:true , message: Messages.UPDATED};
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async getSlotDetails(token:DecodedToken) {
        try {
          const slot = await this._iuserRepository.findSlots(token?.id);
          if(slot) {
            return {status: StatusCode.OK, success:true , message: Messages.FOUND , slot};
          } else {
            return {status: StatusCode.NOT_FOUND, success:false , message: Messages.FAILED};
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async updateUserImg(token:DecodedToken , img:string) {
        try {
          const image = await this._iuserRepository.updateImg(token?.id , img);
          if(image) {
            return {status: StatusCode.OK, success:true , message: Messages.UPDATED , image};
          } else {
            return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async getUserImg(token:DecodedToken ) {
        try {
          if(token) {
            const image = await this._iuserRepository.getImgById(token?.id);
            if(image) {
              return {status: StatusCode.OK, success:true , message: Messages.FETCHED , image};
            } else {
              return {status: StatusCode.NOT_FOUND, success:false , message: Messages.FAILED};
            }
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      } 
      
      async verifyRoomId(roomId:string , userId:string) {
        try {
          const data = await this._iuserRepository.verifyRoomById(roomId);
          if(data) {
            if(data.userId == userId) {
              return {status: StatusCode.OK, success:true};
            } else {
              return {status: StatusCode.UNAUTHORIZED, success:false};
            }
          }
          return {status: StatusCode.NOT_FOUND, success:false};
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }
      
      async updateRating(rating:number , slotId:string) {
        try {
          const data = await this._iuserRepository.updateSlotById(rating , slotId);
          if(data) {
            return {status: StatusCode.OK, success:true};
          } else {
            return {status: StatusCode.NOT_FOUND, success:false};
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }
      
      async googleCallback(email:string , name:string , img:string) {
        try {
          const user = await this._iuserRepository.createUserByGoogle(email , name , img);
          if(user) {
            const token = await this._jwtToken.authToken(user.id , user.email , "User");
            if(token) {
              return {status: StatusCode.OK, success:true , message: Messages.AUTH_SUCCESS , user , authToken:token};
            } else {
              return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
            }
          }
          return {status: StatusCode.BAD_REQUEST, success:false , message: Messages.FAILED};
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async addInstructorReview(instructorId:string , value:string , token:DecodedToken){
        try {
          if(token) {
            const res = await this._iuserRepository.addReview(instructorId , value , token.id);
            if(res) {
              return {status: StatusCode.CREATED, success:true , message: Messages.CREATED};
            } else {
              return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
            }
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false , message: Messages.FAILED};
        }
      }
      
      async verifyRefreshToken(refreshToken:string){
        try {
          const verifiedToken = this._jwtToken.verifyToken(refreshToken);
          if(verifiedToken) {
            const authToken = this._jwtToken.authToken(verifiedToken.id , verifiedToken.email , verifiedToken.role);
            if(authToken) {
              return {status: StatusCode.OK, success:true , authToken};
            } else {
              return {status: StatusCode.UNAUTHORIZED, success:false};
            }
          } else {
            return {status: StatusCode.UNAUTHORIZED, success:false};
          }
        } catch(err:any) {
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async roomStatus(roomId:string) {
        try{
          const res = await this._iuserRepository.getRoomStatus(roomId)
          return {status: StatusCode.OK, success:true , data:res};

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async getTestData(slotId:string) {
        try{
          const res = await this._iuserRepository.getTests(slotId)
          return {status: StatusCode.OK, success:true , data:res};

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async getQuestionData(qId:string) {
        try{
          const res = await this._iuserRepository.getQuestion(qId)
          return {status: StatusCode.OK, success:true , data:res};

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

      async updateResultData(slotId:string , score:number) {
        try{
          const res = await this._iuserRepository.updateResult(slotId , score)
          return {status: StatusCode.OK, success:true };

        }catch(err){
          return {status: StatusCode.INTERNAL_SERVER_ERROR, success:false};
        }
      }

   
        
    }      