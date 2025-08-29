import express from 'express'
import {ChatController} from '../../adaptors/controller/chatController';
import chatAuth from '../middleware/auth';
import { container } from '../inversify.config';

const router = express.Router();

const controller = container.get<ChatController>("ChatController");

router.post('/accessChat' ,chatAuth, (req ,res ,next) => {controller.createChatRoom(req ,res ,next)});

router.get('/fetchChats' , chatAuth,(req ,res ,next) => {controller.fetchChats(req ,res ,next)});

router.post('/createMessage' , chatAuth,(req ,res ,next) => {controller.createMessage(req ,res ,next)});

router.get('/fetchMessage' ,chatAuth,(req ,res ,next) => {controller.fetchMessage(req ,res ,next)});

export default router;