import Chat from "../../entity/Chat";
import Message from "../../entity/Message";

interface IchatRepository {
    accessChat(id:string , tokenId:string): Promise<Chat | null>
    findChatsById(token:string , role:string): Promise<Chat[] | null>
    createMessageById(content:string , chatId:string , id:string ,role:string):Promise<Message | null>
    findMsgById(chatId:string): Promise<Message[] | null>
    findChat(chatId:string): Promise<Chat | null>
}

export default IchatRepository;