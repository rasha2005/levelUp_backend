import express from 'express'
import instructorController from '../../adaptors/controller/instructorController';
import instructorUseCase from '../../usecase/instructorUseCase';
import instructorRepository from '../repository/instructorRepository';
import generateOtp from '../service/generateOtp';
import sendEmailOtp from '../service/sendEmailOtp';
import Jwt from '../service/jwt';
import hashPassword from '../service/hashPassword';
import instructorAuth from '../middleware/instructorAuth';

const router = express.Router();

const InstructorRepository = new instructorRepository();
const GenerateOtp = new generateOtp();
const sendEmail = new sendEmailOtp();
const jwt = new Jwt();
const hashedPassword = new hashPassword();

const useCase = new instructorUseCase(InstructorRepository , GenerateOtp , sendEmail , jwt , hashedPassword);
const controller = new instructorController(useCase);


router.post('/signup' , (req , res , next) => {controller.createInstructor(req , res , next)});

router.post('/verifyOtp' , (req , res , next) => {controller.verifyInstructorOtp(req , res , next)});

router.post('/login' , (req , res , next) => {controller.verifyLogin(req , res , next)});

router.get('/getCategory' , (req , res , next) => {controller.getCatList(req , res , next)});

router.post('/updateinstructor' ,  instructorAuth,(req ,res, next) => {controller.updateInstructor(req , res , next)});

router.get('/getInstructor' ,  instructorAuth,(req ,res, next) => {controller.getInstructorById(req , res , next)});

router.post('/editDetails' , instructorAuth,(req ,res, next) => {controller.editInstructorById(req , res , next)});

router.post('/updateImg' ,  instructorAuth,(req ,res, next) => {controller.updateProfileImg(req , res , next)});

router.post('/resendOtp' , (req ,res, next) => {controller.resendInstructorOtp(req , res , next)});

router.post('/changePassword' ,  (req ,res, next) => {controller.changePassword(req , res , next)});

router.post('/updateSession' , (req ,res, next) => {controller.scheduleSession(req , res , next)});

router.get('/getEvents' , (req ,res, next) => {controller.getEvents(req , res , next)});

router.delete('/deleteEventData' , (req ,res, next) => {controller.deleteEvent(req , res , next)});

router.get('/getSlot' ,  (req ,res, next) => {controller.getSlot(req , res , next)});

router.get('/getWallet' ,(req ,res, next) => {controller.getWallet(req , res , next)});

router.get('/getImg' , (req ,res, next) => {controller.getImg(req , res , next)});

router.get('/verifyRoom' , (req ,res, next) => {controller.verifyRoom(req , res , next)});

export default router;