import { Request, Response, NextFunction } from "express";
import {AdminUseCase} from "../../usecase/adminUseCase";
import { inject } from "inversify";


export class AdminController {
    constructor(@inject("AdminuseCase")private _useCase : AdminUseCase){}

    async admin(req:Request ,res:Response ,next:NextFunction)  {
        const {email , password} = req.body;
         await this._useCase.insertAdmin(email , password);
    }

    async verifyLogin(req:Request ,res:Response ,next:NextFunction) {
      try {
         const {email , password} = req.body;
        const response = await this._useCase.verifyLogin(email , password);
        return res.status(200).json({response});
    }catch(err) {
        next(err);
    }
    }

    async getUserData(req:Request ,res:Response ,next:NextFunction) {
        try {
            const response = await this._useCase.getUsers();
            return res.status(200).json({response})

        }catch(err) {
            next(err);
        }
    }

    async getInstructorData(req:Request ,res:Response ,next:NextFunction) {
        try {
            const response = await this._useCase.getInstructors();
            return res.status(200).json({response})
        }catch(err) {
            next(err);
        }
    }

    async createCategory(req:Request ,res:Response ,next:NextFunction) {
        try{
            const {data} = req.body;
            const response = await this._useCase.createCat(data);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getCategory(req:Request ,res:Response ,next:NextFunction) {
        try {
            const response = await this._useCase.getCatData();
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

    async editCategory(req:Request ,res:Response ,next:NextFunction) {
        try{
            const catName = req.body.catName;
            const id = req.body.id as string;
            const response = await this._useCase.editCatData(catName , id);
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        }
    }

    async deleteCategory(req:Request ,res:Response ,next:NextFunction) {
        try{
            const id = req.body.id as string;
            const response = await this._useCase.deleteCatData(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    } 

    async blockUser(req:Request ,res:Response ,next:NextFunction) {
        try {
            const id = req.body.data.id;
            const response = await this._useCase.blockUserId(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getInstructorById(req:Request ,res:Response ,next:NextFunction) {
        try {
            const id = req.query.id as string
            const response = await this._useCase.getInstructorDetaild(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async approveInstructor(req:Request ,res:Response ,next:NextFunction) {
        try{
            const id = req.body.id
            const response = await this._useCase.instructorApprovel(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async cancelApproveInstructor(req:Request ,res:Response ,next:NextFunction) {
        try{
            const id = req.body.id
            const response = await this._useCase.instructorApprovelCancel(id);
            return res.status(200).json({response});

        }catch(err) {
            next(err);
        } 
    }

    async getUserById(req:Request ,res:Response ,next:NextFunction) {
        try {
            const id = req.query.id as string
            const response = await this._useCase.getUserDetaild(id);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async getDetails(req:Request ,res:Response ,next:NextFunction)  {
        try{
            const response = await this._useCase.fetchDetail();
            res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async fetchTransaction(req:Request ,res:Response ,next:NextFunction) {
        try {
            const response = await this._useCase.getTransaction();
            res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

}
