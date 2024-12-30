import { Request, Response, NextFunction } from "express";
import chatUseCase from "../../usecase/chatUseCase";

class chatController {
    constructor(private useCase:chatUseCase ){}

    async createChatRoom(req:Request , res:Response , next:NextFunction) {
        try{
            const id = req.body.id as string;
            const token = req.cookies.authToken;
            const response = await this.useCase.accessChatRoom(id , token);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async fetchChats(req:Request , res:Response , next:NextFunction) {
        try {
            const token = req.cookies.authToken;
            const response = await this.useCase.fetchChatRooms(token);
            return res.status(200).json({response});
        }catch(err) {
            next(err);
        }
    }

    async createMessage(req:Request , res:Response , next:NextFunction) {
        try{
            const content  = req.body.content;
            const chatId  = req.body.chatId as string;
            const token = req.cookies.authToken;
            const response = await this.useCase.createNewMessage(content , chatId , token);
            res.status(200).json({response})

        }catch(err) {
            next(err);
        }
    }

    async fetchMessage(req:Request , res:Response , next:NextFunction) {
        try {
            const chatId = req.query.chatId as string;
            const response = await this.useCase.fetchMsgs(chatId);
            res.status(200).json({response})
        }catch(err) {
            next(err);
        }
    }
}

export default chatController