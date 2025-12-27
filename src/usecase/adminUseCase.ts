import { injectable,inject } from "inversify";
import IadminRepository from "../interface/repository/IadminRepository";
import IhashPassword from "../interface/services/IhashPassword";
import Ijwt from "../interface/services/Ijwt";
import IsendEmailOtp from "../interface/services/IsendEmailOtp";
import { StatusCode } from "../enums/statuscode";
import { Messages } from "../enums/message";
import { UserDTO } from "./dtos/UserDTO";
import { InstructorDTO } from "./dtos/InstructorDTO";
import { IAdminUseCase } from "../interface/useCase/IadminUsecase";

@injectable()
export class AdminUseCase implements IAdminUseCase{
    constructor(
        @inject("IadminRepository") private _adminRepository:IadminRepository,
        @inject("IhashPassword") private _hashPassword:IhashPassword,
        @inject("Ijwt") private _jwt:Ijwt,
        @inject("IsendEmailOtp") private _email:IsendEmailOtp
    ){}

    async insertAdmin(email: string, password: string) {
        const hashedPassword = await this._hashPassword.hash(password);
        const admin = await this._adminRepository.insert(email, hashedPassword);
        return { status: StatusCode.CREATED, success: true, message: Messages.CREATED, admin };
      }
      
      async verifyLogin(email: string, adminPassword: string) {
        try {
          const admin = await this._adminRepository.findByEmail(email);
      
          if (admin) {
            const password = await this._hashPassword.compare(adminPassword, admin.password);
      
            if (password) {
              const token = this._jwt.authToken(admin.id, admin.email, "Admin");
              return { status: StatusCode.OK, success: true, message: Messages.AUTH_SUCCESS, token };
            } else {
              return { status: StatusCode.UNAUTHORIZED, success: false, message: Messages.AUTH_FAILED };
            }
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async getUsers() {
        try {
          const userData = await this._adminRepository.getUser();
          if (userData  && userData.length > 0) {
            const usersDto = userData.map(user => UserDTO.fromEntity(user));
            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, userData:usersDto };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async getInstructors() {
        try {
          const data = await this._adminRepository.getInstructor();
          if (data.topInstructors) {
            const instructorDto = data.topInstructors.map(i => InstructorDTO.fromEntity(i));

            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, instructorData:instructorDto ,totalInstructor:data.totalInstructorCount ,revenueSummary:data.revenueSummary};
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async createCat(data: string) {
        try {
          const categoryData = await this._adminRepository.createCategory(data);
          if (categoryData) {
            return { status: StatusCode.CREATED, success: true, message: Messages.CREATED, categoryData };
          } else {
            return { status: StatusCode.CONFLICT, success: false, message: "category already exist" };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async getCatData() {
        try {
          const category = await this._adminRepository.getCatData();
          if (category) {
            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, category };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async editCatData(name: string, id: string) {
        try {
          const category = await this._adminRepository.editCatData(name, id);
          if (category) {
            return { status: StatusCode.OK, success: true, message: Messages.UPDATED, category };
          } else {
            return { status: StatusCode.CONFLICT, success: false, message:"category already exist" };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async deleteCatData(id: string) {
        try {
          const category = await this._adminRepository.deleteCatData(id);
          if (category) {
            return { status: StatusCode.OK, success: true, message: Messages.DELETED };
          } else {
            return { status: StatusCode.INTERNAL_SERVER_ERROR, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async blockUserId(id: string) {
        try {
          const user = await this._adminRepository.blockUser(id);
          if (user) {
            const userDTO = UserDTO.fromEntity(user);
    
            return { status: StatusCode.OK, success: true, message: Messages.UPDATED, user:userDTO };
          } else {
            return { status: StatusCode.INTERNAL_SERVER_ERROR, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async getInstructorDetaild(id: string) {
        try {
          const instructor = await this._adminRepository.getInstructorId(id);
          if (instructor) {
            const instructorDto = InstructorDTO.fromEntity(instructor);
            return { status: StatusCode.OK, success: true, message: Messages.FOUND, instructor:instructorDto };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async instructorApprovel(id: string) {
        try {
          const instructor = await this._adminRepository.updateInstructorApprovel(id);
          if (instructor) {
            return { status: StatusCode.OK, success: true, message: Messages.UPDATED };
          } else {
            return { status: StatusCode.INTERNAL_SERVER_ERROR, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async instructorApprovelCancel(id: string) {
        try {
          const instructor = await this._adminRepository.cancelApprovel(id);
          if (instructor) {
            return { status: StatusCode.OK, success: true, message: Messages.UPDATED };
          } else {
            return { status: StatusCode.INTERNAL_SERVER_ERROR, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async getUserDetaild(id: string) {
        try {
          const user = await this._adminRepository.getUserId(id);
          if (user) {
            const userDTO = UserDTO.fromEntity(user)
            return { status: StatusCode.OK, success: true, message: Messages.FOUND, user:userDTO };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async reminder() {
        try {
          const date = new Date();
          const user = await this._adminRepository.findSlotsByDate(date);
      
          if (user) {
            for (const i of user) {
              await this._email.sendReminder(i.user?.email, i.user?.name);
            }
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async fetchDetail() {
        try {
          const wallet = await this._adminRepository.findWallet();
          if (wallet) {
            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, wallet };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async getTransaction(search:string|"" , page:number , limit:number , start:string  | "" , end:string|"") {
        try {
          const transaction = await this._adminRepository.getTransactionDetails(search, page , limit , start , end);
          if (transaction) {
            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, data:transaction.data , total:transaction.total };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }

      async getApproveInstrcutors() {
        try {
          const instructorData = await this._adminRepository.approveInstrcutors();
          if (instructorData) {
            const instructorDto = instructorData.map(i => InstructorDTO.fromEntity(i));

            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, instructorData:instructorDto };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }

      async fetchMonthyRevenue() {
        try {
          const transaction = await this._adminRepository.getMonthlyRevenue();
         
          if (transaction) {
            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, transaction };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }

      async getTicketData(search:string|"" , page:number , limit:number) {
        try {
          const ticket = await this._adminRepository.getAllTickets(search, page , limit);
         
          if (ticket) {
            return { status: StatusCode.OK, success: true, message: Messages.FETCHED, ticket:ticket.tickets , total:ticket.totalCount };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }

      async updateTicketStatus(status:string , ticketId:string) {
        try {
          const ticket = await this._adminRepository.updateTicketById(status , ticketId);
         
          if (ticket) {
            return { status: StatusCode.OK, success: true, message: Messages.UPDATED };
          } else {
            return { status: StatusCode.NOT_FOUND, success: false, message: Messages.FAILED };
          }
        } catch (err: any) {
          throw err;
        }
      }

      async getAllInstructorData() {
        try {
          const data = await this._adminRepository.getAllInstructor();
      
          const instructorDto = data ? data.map(i => InstructorDTO.fromEntity(i)) : [];
      
          return {
            status: StatusCode.OK,
            success: !!data,
            message: data ? Messages.FETCHED : Messages.FAILED,
            instructorData: instructorDto
          };
        } catch (err: any) {
          throw err;
        }
      }
      
    }      
