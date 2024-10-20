import express from 'express'
import userController from '../../adaptors/controller/userController';
import userUseCase from '../../usecase/userUseCase';
import userRepository from '../repository/userRepository';
import generateOtp from '../service/generateOtp';
import sendEmailOtp from '../service/sendEmailOtp';
import Jwt from '../service/jwt';

const router = express.Router();

const UserRepository = new userRepository();
const GenerateOtp = new generateOtp();
const seEmail = new sendEmailOtp();
const jwtToken = new Jwt();


const useCase = new userUseCase(UserRepository , GenerateOtp , seEmail , jwtToken);

const controller = new userController(useCase);

router.post('/signup' , (req , res , next) => {controller.createUser(req , res , next)});


export default router;


