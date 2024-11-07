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

    async getUserData(req:Request ,res:Response ,next:NextFunction) {
        try {
            const response = await this.useCase.getUsers();
            return res.status(200).json({response})

        }catch(err) {
            next(err);
        }
    }

    async getInstructorData(req:Request ,res:Response ,next:NextFunction) {
        try {
            console.log("kkkkk");
            const response = await this.useCase.getInstructors();
            return res.status(200).json({response})
        }catch(err) {
            next(err);
        }
    }

    async createCategory(req:Request ,res:Response ,next:NextFunction) {
        try{
            const {data} = req.body;
            console.log("data" , req.body);
            const response = await this.useCase.createCat(data);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getCategory(req:Request ,res:Response ,next:NextFunction) {
        try {
            console.log("jjjjjjj");
            const response = await this.useCase.getCatData();
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

    async editCategory(req:Request ,res:Response ,next:NextFunction) {
        try{
            const {catName , id} = req.body;
            console.log("vvv", catName , id)
            const response = await this.useCase.editCatData(catName , id);
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

    async deleteCategory(req:Request ,res:Response ,next:NextFunction) {
        try{
            const {id} = req.body;
            const response = await this.useCase.deleteCatData(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    } 

    async blockUser(req:Request ,res:Response ,next:NextFunction) {
        try {
            const id = req.body.data.id;
            const response = await this.useCase.blockUserId(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }
}

export default adminController;