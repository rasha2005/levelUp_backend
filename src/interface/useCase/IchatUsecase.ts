import Chat from "../../entity/Chat";
import Message from "../../entity/Message";
import { UserDTO } from "../../usecase/dtos/UserDTO";

export interface IChatUseCase {
    accessChatRoom(id: string, token: string): Promise<{
      status: number;
      success: boolean;
      message: string;
      chat?: Chat;
    }>;
  
    fetchChatRooms(token: string): Promise<{
      status: number;
      success: boolean;
      message: string;
      chats?: Chat[];
      user?: UserDTO;
    }>;
  
    createNewMessage(content: string, chatId: string, token: string): Promise<{
      status: number;
      success: boolean;
      message: string;
      res?: Message;
    }>;
  
    fetchMsgs(chatId: string): Promise<{
      status: number;
      success: boolean;
      message: string;
      data?: Message[];
      chat?: any;
    }>;
  }
  