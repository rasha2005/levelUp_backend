import { Request, Response, NextFunction } from "express";
import {ChatUseCase} from "../../usecase/chatUseCase";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../enums/statuscode";

@injectable()
export class ChatController {
    constructor(@inject("ChatUseCase") private _useCase:ChatUseCase ){}

    async createChatRoom(req:Request , res:Response , next:NextFunction) {
        try{
            const id = req.body.id as string;
            const token = req.cookies.authToken;
            const response = await this._useCase.accessChatRoom(id , token);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async fetchChats(req:Request , res:Response , next:NextFunction) {
        try {
            const token = req.cookies.authToken;
            const response = await this._useCase.fetchChatRooms(token);
            return res.status(StatusCode.OK).json({response});
        }catch(err) {
            next(err);
        }
    }

    async createMessage(req:Request , res:Response , next:NextFunction) {
        try{
            const content  = req.body.content;
            const chatId  = req.body.chatId as string;
            const token = req.cookies.authToken;
            const response = await this._useCase.createNewMessage(content , chatId , token);
            res.status(StatusCode.OK).json({response})

        }catch(err) {
            next(err);
        }
    }

    async fetchMessage(req:Request , res:Response , next:NextFunction) {
        try {
            const chatId = req.query.chatId as string;
            const response = await this._useCase.fetchMsgs(chatId);
            res.status(StatusCode.OK).json({response})
        }catch(err) {
            next(err);
        }
    }
}
