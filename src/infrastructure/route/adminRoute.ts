import express from 'express'
import {AdminController} from '../../adaptors/controller/adminController'
import adminAuth from '../middleware/auth';
import { container } from '../inversify.config';

const router = express.Router();

const controller =  container.get<AdminController>("AdminController");

router.post('/inserAdmin' , (req ,res ,next) => {controller.admin(req ,res ,next)});

router.post('/verifyLogin' , (req ,res ,next) => {controller.verifyLogin(req ,res , next)});

router.get('/getUsers' , adminAuth,(req ,res ,next) => {controller.getUserData(req ,res , next)});

router.get('/getInstructor' , adminAuth,(req ,res ,next) => {controller.getInstructorData(req ,res , next)});

router.post('/createCategory' , adminAuth,(req ,res ,next) => {controller.createCategory(req, res, next)});

router.get('/getCategory' , adminAuth,(req,res,next) => {controller.getCategory(req, res, next)});

router.post('/editCategory' , adminAuth,(req,res,next) => {controller.editCategory(req, res, next)} );

router.delete('/deleteCategory' ,adminAuth,(req,res,next) => {controller.deleteCategory(req, res, next)} );

router.post('/blockUser' ,adminAuth, (req,res,next) => {controller.blockUser(req, res, next)});

router.get('/getInstructorById' , adminAuth,(req ,res, next) => {controller.getInstructorById(req, res, next)});

router.post('/approveInstructor' ,adminAuth, (req ,res, next) => {controller.approveInstructor(req, res, next)});

router.post('/cancelApprovel' ,adminAuth,(req ,res, next) => {controller.cancelApproveInstructor(req, res, next)} )

router.get('/getUser' , adminAuth,(req ,res, next) => {controller.getUserById(req, res, next)});

router .get('/fetchDetails' ,adminAuth, (req ,res, next) => {controller.getDetails(req, res, next)});

router.get('/fetchTransaction' , adminAuth, (req ,res, next) => {controller.fetchTransaction(req, res, next)})
export default router;