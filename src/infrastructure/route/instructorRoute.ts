import express from 'express'
import instructorController from '../../adaptors/controller/instructorController';
import instructorUseCase from '../../usecase/instructorUseCase';
import instructorRepository from '../repository/instructorRepository';
import generateOtp from '../service/generateOtp';
import sendEmailOtp from '../service/sendEmailOtp';
import Jwt from '../service/jwt';
import hashPassword from '../service/hashPassword';

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

export default router;