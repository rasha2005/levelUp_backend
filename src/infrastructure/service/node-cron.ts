import cron from "node-cron";
import IadminRepository from "../../interface/repository/IadminRepository";
import IhashPassword from "../../interface/services/IhashPassword";
import Ijwt from "../../interface/services/Ijwt";
import AdminRepository from "../repository/adminRepository";
import HashPassword from "./hashPassword";
import Jwt from "./jwt";
import adminUseCase from "../../usecase/adminUseCase";
import SendEmailOtp from "./sendEmailOtp";
import IsendEmailOtp from "../../interface/services/IsendEmailOtp";



const adminRepository: IadminRepository = new AdminRepository();
const hashPassword: IhashPassword = new HashPassword();
const jwt: Ijwt = new Jwt() ;
const sendEmailOtp: IsendEmailOtp = new SendEmailOtp();


const adminUseCaseInstance = new adminUseCase(hashPassword, adminRepository, jwt , sendEmailOtp);

const startCronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Executing task at midnight...");
    try {
      await adminUseCaseInstance.reminder();
      console.log("Reminder executed successfully.");
    } catch (error) {
      console.error("Error in reminder function:", error);
    }
  });
};


export default startCronJob;