import { Request, Response, NextFunction } from "express";
import userUseCase from "../../usecase/userUseCase";

class userController {
    constructor(private useCase:userUseCase){}

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("its hereee yayayaya")
            console.log("req.body",req.body.email)

            const { email } = req.body;
            const user = req.body

            const response = await this.useCase.findUser(user);

            console.log("resdksjakdl" , response);
            if(response.success === true) {
                console.log("kkkkkk",response.token);
                return res.status(200).json({ success: true ,token:response.token});
            }else{
                return res.status(200).json({success:false , message:"user found"})
            }

        }catch (err) {
            next(err);
        }
    }

    async verifyUserOtp(req: Request, res: Response, next: NextFunction) {
        try {

            const {userOtp , token} = req.body;

            console.log("user" , userOtp);
            console.log("tokenn" , token);

            const response = await this.useCase.saveUser(userOtp , token);
            if(response) {
                console.log("kkkkk");
                return res.status(200).json(response);
            }

        }catch (err) {
            next(err);
        }
    }

    async verifyLogin(req:Request ,  res: Response, next: NextFunction) {
        try{
            const {email , password} = req.body;
            const response = await this.useCase.verifyLogin(email , password);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }
}

export default userController;