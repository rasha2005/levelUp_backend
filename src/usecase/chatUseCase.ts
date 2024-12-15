import IchatRepository from "../interface/repository/IchatRepository";
import Ijwt from "../interface/services/Ijwt";

class chatUseCase {
    constructor(
        private _ichatRepository: IchatRepository,
        private _ichatJwt: Ijwt
    ){}

    async accessChatRoom(id:any , token:string) {
        
        const decode = await this._ichatJwt.verifyToken(token)
        if(decode) {
            const tokenId = decode.id;
            const chat = await this._ichatRepository.accessChat(id , tokenId);
            if(chat) {
                return {success:true , message:"chat retrived successfully" , chat};
            }else{
                return {success:false , message:"chat not found"}
            }
        }

    }
    async fetchChatRooms(token:string) {
        
        const decode = await this._ichatJwt.verifyToken(token);
        if(decode) {
            const chats = await this._ichatRepository.findChatsById(decode.id , decode.role);
            
            if(chats) {
                return {success:true , message:"chat retrived successfully" , chats ,user:decode.id};
            }else{
                return {success:false , message:"chat not found"}
            }
        }
    }

    async createNewMessage(content:string , chatId:any , token:string) {
        const decode = await this._ichatJwt.verifyToken(token);
        if(decode) {
            const res = await this._ichatRepository.createMessageById(content , chatId , decode.id);
            if(res) {
                return {success:true , message:"message created successfully" , res};
            }else{
                return {success:false , message:"something went wrong"}
            }
        }
    }


    async fetchMsgs(chatId:any) {
        const data = await this._ichatRepository.findMsgById(chatId);
        if(data) {
            const chat = await this._ichatRepository.findChat(chatId);
            return {success:true , message:"message retrived successfully" , data , chat};
        }else{
            return {success:false , message:"something went wrong"}
        }
    }
}

export default chatUseCase