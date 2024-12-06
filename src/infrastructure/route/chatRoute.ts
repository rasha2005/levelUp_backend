import express from 'express'
import chatRepository from '../repository/chatRepository';
import chatUseCase from '../../usecase/chatUseCase';
import chatController from '../../adaptors/controller/chatController';
import Jwt from '../service/jwt';

const router = express.Router();

const ChatRespository = new chatRepository();
const jwt = new Jwt()

const useCase = new chatUseCase(ChatRespository , jwt);
const controller = new chatController(useCase);

router.post('/accessChat' , (req ,res ,next) => {controller.createChatRoom(req ,res ,next)});

router.get('/fetchChats' , (req ,res ,next) => {controller.fetchChats(req ,res ,next)});

router.post('/createMessage' , (req ,res ,next) => {controller.createMessage(req ,res ,next)});

router.get('/fetchMessage' ,(req ,res ,next) => {controller.fetchMessage(req ,res ,next)});

export default router;