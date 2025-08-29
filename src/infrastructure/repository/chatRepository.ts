import { PrismaClient  , Prisma} from "@prisma/client";
import IchatRepository from "../../interface/repository/IchatRepository";
import Chat from "../../entity/Chat";
import Message from "../../entity/Message";
import { injectable } from "inversify";

const prisma  = new PrismaClient();

@injectable()
export class ChatRepository implements IchatRepository {
    async accessChat(id: string, tokenId: string): Promise<Chat|null> {
        const chat = await prisma.chat.findFirst({
            where:{
                userId:tokenId,
                instructorId:id
            }
        })

        if(!chat){
            const newChat = await prisma.chat.create({
                data:{
                    userId:tokenId,
                    instructorId:id
                },
            
            })
            return newChat
        }else{
            return chat
        }

        return null
    }

    async findChatsById(token: string , role:string): Promise<Chat[] | null> {
        if(role === "User"){
            const userChats = await prisma.chat.findMany({
                where:{
                    userId:token
                },
                include:{instructor:true}
            }) 
            return userChats;
        }else if(role === "Instructor"){
            const instructorChat = await prisma.chat.findMany({
                where:{
                    instructorId:token
                },
                include:{user:true}
            })
            return instructorChat
        }
        return null
    }

    async createMessageById(content: string, chatId: string, id: string): Promise<Message | null> {
        const messsage = await prisma.message.create({
            data:{
                senderId:id,
                content:content,
                chatId:chatId
            },
            include:{chat:true}
        })
     

        if(messsage) {
            return messsage
        }

        return null
    }

    async findMsgById(chatId: string): Promise<Message[] | null> {
        const message = await prisma.message.findMany({
            where:{
                chatId:chatId
            },
            
            
           
        })
        if(message) {
            return message
        }
        return null
    }

    async findChat(chatId: any): Promise<Chat | null> {
        const chat = await prisma.chat.findUnique({
            where:{
                id:chatId
            },
            include:{user:true , instructor:true}
        })
        if(chat){
            return chat
        }
        return null
    }
}
