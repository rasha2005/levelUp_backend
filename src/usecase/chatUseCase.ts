import { inject, injectable } from "inversify";
import IchatRepository from "../interface/repository/IchatRepository";
import Ijwt from "../interface/services/Ijwt";
import { StatusCode } from "../enums/statuscode";
import { Messages } from "../enums/message";

@injectable()
export class ChatUseCase {
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
                status: StatusCode.OK,
                success: true,
                message: Messages.FETCHED,
                chat,
              };
            } else {
              return {
                status: StatusCode.NOT_FOUND,
                success: false,
                message: Messages.FAILED,
              };
            }
          }
        } catch (err: any) {
          throw err;
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
                status: StatusCode.OK,
                success: true,
                message: Messages.FETCHED,
                chats,
                user: decode.id,
              };
            } else {
              return {
                status: StatusCode.NOT_FOUND,
                success: false,
                message: Messages.FAILED,
              };
            }
          }
        } catch (err: any) {
          throw err;
        }
      }
      
      async createNewMessage(content: string, chatId: string, token: string) {
        try {
          const decode = await this._ichatJwt.verifyToken(token);
      
          if (decode) {
            const res = await this._ichatRepository.createMessageById(
              content,
              chatId,
              decode.id
            );
      
            if (res) {
              return {
                status: StatusCode.CREATED,
                success: true,
                message: Messages.CREATED,
                res,
              };
            } else {
              return {
                status: StatusCode.BAD_REQUEST,
                success: false,
                message: Messages.FAILED,
              };
            }
          }
        } catch (err: any) {
          throw err;
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
