import { inject, injectable } from "inversify";
import IchatRepository from "../interface/repository/IchatRepository";
import Ijwt from "../interface/services/Ijwt";
import { StatusCode } from "../enums/statuscode";
import { Messages } from "../enums/message";
import { IChatUseCase } from "../interface/useCase/IchatUsecase";

@injectable()
export class ChatUseCase implements IChatUseCase {
    constructor(
        @inject("IchatRepository") private _ichatRepository: IchatRepository,
        @inject("Ijwt") private _ichatJwt: Ijwt
    ){}

    async accessChatRoom(id: string, token: string) {
      try {
        const decode = await this._ichatJwt.verifyToken(token);

        if (decode) {
            const tokenId = decode.id;
            const chat = await this._ichatRepository.accessChat(id, tokenId);

            if (chat) {
                return {
                    status: 200,
                    success: true,
                    message: "Fetched successfully",
                    chat,
                };
            } else {
                return {
                    status: 404,
                    success: false,
                    message: "Chat not found",
                };
            }
        }

        // Return a default failure if token is invalid
        return {
            status: 401,
            success: false,
            message: "Invalid token",
        };

    } catch (err: any) {
       
        return {
            status: 500,
            success: false,
            message: "Internal server error",
        };
    }
      }
      
      async fetchChatRooms(token: string) {
        try {
          const decode = await this._ichatJwt.verifyToken(token);
  
          if (decode) {
              const chats = await this._ichatRepository.findChatsById(
                  decode.id,
                  decode.role
              );
  
              if (chats) {
                  return {
                      status: 200,
                      success: true,
                      message: "Fetched successfully",
                      chats,
                      user: decode.id,
                  };
              } else {
                  return {
                      status: 404,
                      success: false,
                      message: "No chats found",
                  };
              }
          }
  
          // Default return if token is invalid
          return {
              status: 401,
              success: false,
              message: "Invalid token",
          };
  
      } catch (err: any) {
         
          return {
              status: 500,
              success: false,
              message: "Internal server error",
          };
      }
      }
      
      async createNewMessage(content: string, chatId: string, token: string) {
        try {
          const decode = await this._ichatJwt.verifyToken(token);
      
          if (decode) {
            const res = await this._ichatRepository.createMessageById(
              content,
              chatId,
              decode.id,
              decode.role
            );
      
            if (res) {
              return {
                status: 201,
                success: true,
                message: "Message created successfully",
                res,
              };
            } else {
              return {
                status: 400,
                success: false,
                message: "Failed to create message",
              };
            }
          }
      
         
          return {
            status: 401,
            success: false,
            message: "Invalid token",
          };
        } catch (err: any) {
         
          return {
            status: 500,
            success: false,
            message: "Internal server error",
          };
        }
      }
      
      async fetchMsgs(chatId: string) {
        try {
          const data = await this._ichatRepository.findMsgById(chatId);
      
          if (data) {
            const chat = await this._ichatRepository.findChat(chatId);
      
            return {
              status: StatusCode.OK,
              success: true,
              message: Messages.FOUND,
              data,
              chat,
            };
          } else {
            return {
              status: StatusCode.NOT_FOUND,
              success: false,
              message: Messages.FAILED,
            };
          }
        } catch (err: any) {
          throw err;
        }
      }
    }
