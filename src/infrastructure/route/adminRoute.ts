import express from 'express'
import adminController from '../../adaptors/controller/adminController';
import adminUseCase from '../../usecase/adminUseCase';
import hashPassword from '../service/hashPassword';
import adminRepository from '../repository/adminRepository';
import Jwt from '../service/jwt';

const passwordHash = new hashPassword();
const AdminRepository = new adminRepository();
const jwt = new Jwt();

const useCase = new adminUseCase(passwordHash , AdminRepository , jwt)
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
export default router;