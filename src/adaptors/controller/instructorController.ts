import { Request, Response, NextFunction } from "express";
import instructorUseCase from "../../usecase/instructorUseCase";


class instructorController {
    constructor(private useCase:instructorUseCase){}

    async createInstructor(req:Request , res:Response , next:NextFunction) {
        try {
            const instructor = req.body;

            const response = await this.useCase.findInsrtuctor(instructor);
            
            if(response.success === true) {
                return res.status(200).json({ success: true ,token:response.token});
            }else{
                return res.status(200).json({success:false , message:"user found"})
            }
            
        } catch(err) {
            next(err);
        }

    } 

    async verifyInstructorOtp(req:Request , res:Response , next:NextFunction) {
        try{

            const {instructorOtp , token} = req.body;

            const response = await this.useCase.saveInstructor(instructorOtp , token);
            console.log("qqqqqq");
            return res.status(200).json({response})
        }catch(err){
            next(err);
        }
    }

    async verifyLogin(req:Request , res:Response , next:NextFunction) {
        try{
            const {email , password} = req.body;
            const response = await this.useCase.verifyLogin(email , password);
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }
}

export default instructorController;