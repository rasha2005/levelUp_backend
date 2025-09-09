import express from 'express'
import {UserController} from '../../adaptors/controller/userController';
import userAuth from '../middleware/auth';
import { container } from '../inversify.config';



const router = express.Router();

const userController = container.get<UserController>("UserController");


router.post('/signup' , (req , res , next) => {userController.createUser(req , res , next)});
router.post('/verifyOtp' , (req , res , next) => {userController.verifyUserOtp(req , res , next)});
router.post('/login' , (req , res , next) => {userController.verifyLogin(req ,res , next)});
router.get('/home' ,userAuth,(req , res , next) => {userController.home(req ,res , next)} );
router.get('/userDetails' , userAuth,(req , res, next) => {userController.profile(req ,res , next)});
router.post('/updateUser' , userAuth , (req , res, next) => {userController.updateUser(req ,res , next)});
router.get('/getInstructor' , userAuth , (req , res, next) => {userController.getInstructorData(req ,res , next)});
router.post('/resendOtp' ,(req , res, next) => {userController.resendInstructorOtp(req ,res , next)});
router.post('/changePassword' , userAuth,(req , res, next) => {userController.changePassword(req ,res , next)});
router.get('/getInstructorData' , userAuth , (req , res, next) => {userController.getInstructor(req ,res , next)});
router.post('/create-checkout-session', (req , res, next) => {userController.payement(req ,res , next)});
router.post('/webhook',  (req, res, next ) => userController.stripeWebhook(req, res, next));
router.get('/getSlots' , userAuth ,(req , res, next) => {userController.getSlots(req ,res , next)});
router.post('/setImg' , userAuth,(req , res, next) => {userController.setImg(req ,res , next)});
router.get('/getImg' , userAuth ,(req , res, next) => {userController.getImg(req ,res , next)});
router.get('/verifyRoom' ,(req , res, next) => {userController.verifyRoom(req ,res , next)});
router.post('/rating'  , (req , res, next) => {userController.rating(req ,res , next)});
router.post('/googleAuth' , (req , res, next) => {userController.googleAuth(req ,res , next)});
router.post('/addReview' , (req , res, next) => {userController.addReview(req ,res , next)});
router.post('/refreshToken' , (req , res, next) => {userController.refreshToken(req ,res , next)})





export default router;


