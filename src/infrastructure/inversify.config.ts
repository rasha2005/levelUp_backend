import { Container } from "inversify";
import  {UserRepository}  from "../infrastructure/repository/userRepository";
import  {UserUseCase}  from "../usecase/userUseCase";
import {UserController} from "../adaptors/controller/userController";
import { InstructorUseCase } from "../usecase/instructorUseCase";
import { InstructorController } from "../adaptors/controller/instructorController";
import { InstructorRepository } from "./repository/instructorRepository";
import generateOtp from "./service/generateOtp";
import sendEmailOtp from "./service/sendEmailOtp";
import Jwt from "./service/jwt";
import hashPassword from "./service/hashPassword";
import stripe from "./service/stripe";
import { ChatRepository } from "./repository/chatRepository";
import { ChatUseCase } from "../usecase/chatUseCase";
import { ChatController } from "../adaptors/controller/chatController";
import { AdminRepository } from "./repository/adminRepository";
import { AdminUseCase } from "../usecase/adminUseCase";
import { AdminController } from "../adaptors/controller/adminController";

const container = new Container();

// Bind Repositories
container.bind("IuserRepository").to(UserRepository);
container.bind("IinstructorRepository").to(InstructorRepository)
container.bind("IchatRepository").to(ChatRepository)
container.bind("IadminRepository").to(AdminRepository)

// Bind Services
container.bind("IgenerateOtp").to(generateOtp);
container.bind("IsendEmailOtp").to(sendEmailOtp);
container.bind("Ijwt").to(Jwt);
container.bind("IhashPassword").to(hashPassword);
container.bind("Istripe").to(stripe);

// Bind UseCases
container.bind("IuserUsecase").to(UserUseCase);
container.bind("IinstructorUsecase").to(InstructorUseCase)
container.bind("IchatUsecase").to(ChatUseCase)
container.bind("IadminUsecase").to(AdminUseCase)


// Bind Controllers
container.bind("UserController").to(UserController);
container.bind("InstructorController").to(InstructorController)
container.bind("ChatController").to(ChatController)
container.bind("AdminController").to(AdminController)

export { container };
