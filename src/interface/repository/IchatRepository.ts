import Chat from "../../entity/Chat";
import Message from "../../entity/Message";

interface IchatRepository {
    accessChat(id:any , tokenId:any): Promise<Chat | null>
    findChatsById(token:string , role:string): Promise<Chat[] | null>
    createMessageById(content:string , chatId:any , id:any):Promise<Message | null>
    findMsgById(chatId:any): Promise<Message[] | null>
    findChat(chatId:any): Promise<Chat | null>
}

export default IchatRepository;