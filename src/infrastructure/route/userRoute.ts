import express from 'express'
import userController from '../../adaptors/controller/userController';
import userUseCase from '../../usecase/userUseCase';
import userRepository from '../repository/userRepository';
import generateOtp from '../service/generateOtp';
import sendEmailOtp from '../service/sendEmailOtp';
import Jwt from '../service/jwt';
import hashPassword from '../service/hashPassword';
import userAuth from '../middleware/userAuth';
import stripe from '../service/stripe';

const router = express.Router();

const UserRepository = new userRepository();
const GenerateOtp = new generateOtp();
const seEmail = new sendEmailOtp();
const jwtToken = new Jwt();
const passwordHash = new hashPassword();
const Stripe = new stripe();


const useCase = new userUseCase(UserRepository , GenerateOtp , seEmail , jwtToken , passwordHash , Stripe);

const controller = new userController(useCase);

router.post('/signup' , (req , res , next) => {controller.createUser(req , res , next)});
router.post('/verifyOtp' , (req , res , next) => {controller.verifyUserOtp(req , res , next)});
router.post('/login' , (req , res , next) => {controller.verifyLogin(req ,res , next)});
router.get('/home' ,userAuth,(req , res , next) => {controller.home(req ,res , next)} );
router.get('/userDetails' , userAuth,(req , res, next) => {controller.profile(req ,res , next)});
router.post('/updateUser' , userAuth , (req , res, next) => {controller.updateUser(req ,res , next)});
router.get('/getInstructor' , userAuth , (req , res, next) => {controller.getInstructorData(req ,res , next)});
router.post('/resendOtp' ,(req , res, next) => {controller.resendInstructorOtp(req ,res , next)});
router.post('/changePassword' , (req , res, next) => {controller.changePassword(req ,res , next)});
router.get('/getInstructorData' , (req , res, next) => {controller.getInstructor(req ,res , next)});
router.post('/create-checkout-session', (req , res, next) => {controller.payement(req ,res , next)});
router.post('/webhook', express.raw({type: ['application/json', 'application/json; charset=utf-8']}), (req, res, next ) => controller.stripeWebhook(req, res, next));
router.get('/getSlots' ,(req , res, next) => {controller.getSlots(req ,res , next)});
router.post('/setImg' , (req , res, next) => {controller.setImg(req ,res , next)});
router.get('/getImg' , (req , res, next) => {controller.getImg(req ,res , next)});
router.get('/verifyRoom' ,(req , res, next) => {controller.verifyRoom(req ,res , next)});
router.post('/rating' , (req , res, next) => {controller.rating(req ,res , next)});
router.post('/googleAuth' , (req , res, next) => {controller.googleAuth(req ,res , next)});
router.post('/addReview' , (req , res, next) => {controller.addReview(req ,res , next)});
router.post('/refreshToken' , (req , res, next) => {controller.refreshToken(req ,res , next)})





export default router;


