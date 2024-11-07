import express from 'express'
import userController from '../../adaptors/controller/userController';
import userUseCase from '../../usecase/userUseCase';
import userRepository from '../repository/userRepository';
import generateOtp from '../service/generateOtp';
import sendEmailOtp from '../service/sendEmailOtp';
import Jwt from '../service/jwt';
import hashPassword from '../service/hashPassword';
import userAuth from '../middleware/userAuth';

const router = express.Router();

const UserRepository = new userRepository();
const GenerateOtp = new generateOtp();
const seEmail = new sendEmailOtp();
const jwtToken = new Jwt();
const passwordHash = new hashPassword();


const useCase = new userUseCase(UserRepository , GenerateOtp , seEmail , jwtToken , passwordHash);

const controller = new userController(useCase);

router.post('/signup' , (req , res , next) => {controller.createUser(req , res , next)});
router.post('/verifyOtp' , (req , res , next) => {controller.verifyUserOtp(req , res , next)});
router.post('/login' , (req , res , next) => {controller.verifyLogin(req ,res , next)});
router.get('/home' ,userAuth,(req , res , next) => {controller.home(req ,res , next)} );
router.get('/userDetails' , userAuth,(req , res, next) => {controller.profile(req ,res , next)});
router.post('/updateUser' , userAuth , (req , res, next) => {controller.updateUser(req ,res , next)})






export default router;


