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
router.post('/addReview' , userAuth,(req , res, next) => {userController.addReview(req ,res , next)});
router.post('/refreshToken' , (req , res, next) => {userController.refreshToken(req ,res , next)});
router.get('/roomStatus' , userAuth,(req , res, next) => {userController.getRoomStatus(req ,res , next)});
router.get('/getTest' , userAuth,(req , res, next) => {userController.getTest(req ,res , next)});
router.get('/getQuestion' ,userAuth, (req , res, next) => {userController.getQuestion(req ,res , next)});
router.put('/updateResult' ,userAuth, (req , res, next) => {userController.updateResult(req ,res , next)});
router.get('/getCourse' ,userAuth, (req , res, next) => {userController.getCourse(req ,res , next)});
router.post('/create-course-checkout-session' ,userAuth, (req , res, next) => {userController.coursePayment(req ,res , next)});
router.get('/studentCourse' ,userAuth, (req , res, next) => {userController.studentCourse(req ,res , next)});
router.get('/getNotification' ,userAuth, (req , res, next) => {userController.getNotification(req ,res , next)});
router.delete('/deleteNotifications' ,userAuth, (req , res, next) => {userController.deleteNotifications(req ,res , next)});
router.get('/getBannerData' ,userAuth, (req , res, next) => {userController.getBannerData(req ,res , next)});
router.get('/latestCourse' ,userAuth, (req , res, next) => {userController.getLatestCourse(req ,res , next)});
router.get('/popularInstrcutors' ,userAuth, (req , res, next) => {userController.getPopularInstrcutors(req ,res , next)});
router.get('/searchCourse' ,userAuth, (req , res, next) => {userController.getSearchCourse(req ,res , next)});
router.post('/raiseTicket' ,userAuth, (req , res, next) => {userController.raiseCourseTicket(req ,res , next)});
router.post('/createQnA' ,userAuth, (req , res, next) => {userController.createQnA(req ,res , next)});
router.get('/fetchQnAData' ,userAuth, (req , res, next) => {userController.fetchQnAData(req ,res , next)});
router.get('/announcements' ,userAuth, (req , res, next) => {userController.fetchAnnoucementData(req ,res , next)});


















export default router;


