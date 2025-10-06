import express from 'express'
import {InstructorController} from '../../adaptors/controller/instructorController';
import instructorAuth from '../middleware/auth';
import { container } from '../inversify.config';

const router = express.Router();

const instructorController = container.get<InstructorController>("InstructorController");


router.post('/signup' , (req , res , next) => {instructorController.createInstructor(req , res , next)});

router.post('/verifyOtp' , (req , res , next) => {instructorController.verifyInstructorOtp(req , res , next)});

router.post('/login' , (req , res , next) => {instructorController.verifyLogin(req , res , next)});

router.get('/getCategory' , (req , res , next) => {instructorController.getCatList(req , res , next)});

router.post('/updateinstructor' ,  instructorAuth,(req ,res, next) => {instructorController.updateInstructor(req , res , next)});

router.get('/getInstructor' ,  instructorAuth,(req ,res, next) => {instructorController.getInstructorById(req , res , next)});

router.post('/editDetails' , instructorAuth,(req ,res, next) => {instructorController.editInstructorById(req , res , next)});

router.post('/updateImg' ,  instructorAuth,(req ,res, next) => {instructorController.updateProfileImg(req , res , next)});

router.post('/resendOtp' , (req ,res, next) => {instructorController.resendInstructorOtp(req , res , next)});

router.post('/changePassword' , instructorAuth, (req ,res, next) => {instructorController.changePassword(req , res , next)});

router.post('/updateSession' , instructorAuth,(req ,res, next) => {instructorController.scheduleSession(req , res , next)});

router.get('/getEvents' , instructorAuth,(req ,res, next) => {instructorController.getEvents(req , res , next)});

router.delete('/deleteEventData' ,instructorAuth, (req ,res, next) => {instructorController.deleteEvent(req , res , next)});

router.get('/getSlot' , instructorAuth, (req ,res, next) => {instructorController.getSlot(req , res , next)});

router.get('/getWallet' ,instructorAuth,(req ,res, next) => {instructorController.getWallet(req , res , next)});

router.get('/getImg' , instructorAuth,(req ,res, next) => {instructorController.getImg(req , res , next)});

router.get('/verifyRoom' , (req ,res, next) => {instructorController.verifyRoom(req , res , next)});

router.put('/joinedRoom' , (req ,res, next) => {instructorController.joinedRoom(req , res , next)});

router.post('/createBundle' , instructorAuth,(req ,res, next) => {instructorController.createBundle(req , res , next)});

router.get('/BundleData' , instructorAuth,(req ,res, next) => {instructorController.bundleData(req , res , next)});

router.post('/createQuestion', instructorAuth,(req ,res, next) => {instructorController.createQuestion(req , res , next)})

router.get('/getQuestions', instructorAuth,(req ,res, next) => {instructorController.getQuestions(req , res , next)})

router.post('/createTest', instructorAuth,(req ,res, next) => {instructorController.createTest(req , res , next)})

router.delete('/deleteQuestion' , instructorAuth,(req , res, next) => {instructorController.deleteQuestion(req ,res , next)});

router.delete('/deleteBundle' , instructorAuth,(req , res, next) => {instructorController.deleteBundle(req ,res , next)});

router.put('/updateBundle' ,instructorAuth, (req , res, next) => {instructorController.updateBundle(req ,res , next)});

router.post('/courseBundle' ,instructorAuth, (req , res, next) => {instructorController.courseBundle(req ,res , next)});

router.get('/courseData' ,instructorAuth, (req , res, next) => {instructorController.courseData(req ,res , next)});

router.post('/courseSlot' , instructorAuth,(req , res, next) => {instructorController.courseSlot(req ,res , next)});

router.get('/getCourseSlots' ,instructorAuth, (req , res, next) => {instructorController.getCourseSlots(req ,res , next)});

router.put('/bundleStatus' , instructorAuth,(req , res, next) => {instructorController.bundleStatus(req ,res , next)});

router.post ('/announcememt' ,instructorAuth, (req , res, next) => {instructorController.createAnnouncement(req ,res , next)});

router.delete ('/deleletSlot' ,instructorAuth, (req , res, next) => {instructorController.deleteCourseSlot(req ,res , next)});

router.delete ('/deleteCourse' ,instructorAuth, (req , res, next) => {instructorController.deleteCourse(req ,res , next)});

router.put('/updateCourse' , instructorAuth,(req , res, next) => {instructorController.updateCourse(req ,res , next)});





export default router;