import express from 'express'
import adminController from '../../adaptors/controller/adminController';
import adminUseCase from '../../usecase/adminUseCase';
import hashPassword from '../service/hashPassword';
import adminRepository from '../repository/adminRepository';
import Jwt from '../service/jwt';
import sendEmailOtp from '../service/sendEmailOtp';

const passwordHash = new hashPassword();
const AdminRepository = new adminRepository();
const jwt = new Jwt();
const sendEmail = new sendEmailOtp();

const useCase = new adminUseCase(passwordHash , AdminRepository , jwt , sendEmail)
const controller = new adminController(useCase);

const router = express.Router();

router.post('/inserAdmin' , (req ,res ,next) => {controller.admin(req ,res ,next)});

router.post('/verifyLogin' , (req ,res ,next) => {controller.verifyLogin(req ,res , next)});

router.get('/getUsers' , (req ,res ,next) => {controller.getUserData(req ,res , next)});

router.get('/getInstructor' , (req ,res ,next) => {controller.getInstructorData(req ,res , next)});

router.post('/createCategory' , (req ,res ,next) => {controller.createCategory(req, res, next)});

router.get('/getCategory' , (req,res,next) => {controller.getCategory(req, res, next)});

router.post('/editCategory' , (req,res,next) => {controller.editCategory(req, res, next)} );

router.delete('/deleteCategory' ,(req,res,next) => {controller.deleteCategory(req, res, next)} );

router.post('/blockUser' , (req,res,next) => {controller.blockUser(req, res, next)});

router.get('/getInstructorById' , (req ,res, next) => {controller.getInstructorById(req, res, next)});

router.post('/approveInstructor' , (req ,res, next) => {controller.approveInstructor(req, res, next)});

router.post('/cancelApprovel' ,(req ,res, next) => {controller.cancelApproveInstructor(req, res, next)} )

router.get('/getUser' , (req ,res, next) => {controller.getUserById(req, res, next)});

router .get('/fetchDetails' , (req ,res, next) => {controller.getDetails(req, res, next)});

router.get('/fetchTransaction' ,  (req ,res, next) => {controller.fetchTransaction(req, res, next)})
export default router;