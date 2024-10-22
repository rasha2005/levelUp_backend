import { Request, Response, NextFunction } from "express";
import adminUseCase from "../../usecase/adminUseCase";


class adminController {
    constructor(private useCase : adminUseCase){}

    async admin(req:Request ,res:Response ,next:NextFunction)  {
        const {email , password} = req.body;
        const response = await this.useCase.insertAdmin(email , password);
    }

    async verifyLogin(req:Request ,res:Response ,next:NextFunction) {
      try {
         const {email , password} = req.body;
        const response = await this.useCase.verifyLogin(email , password);
        return res.status(200).json({response});
    }catch(err) {
        next(err);
    }
    }
}

export default adminController;