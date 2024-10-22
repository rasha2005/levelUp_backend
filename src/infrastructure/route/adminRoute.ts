import express from 'express'
import adminController from '../../adaptors/controller/adminController';
import adminUseCase from '../../usecase/adminUseCase';
import hashPassword from '../service/hashPassword';
import adminRepository from '../repository/adminRepository';

const passwordHash = new hashPassword();
const AdminRepository = new adminRepository();

const useCase = new adminUseCase(passwordHash , AdminRepository)
const controller = new adminController(useCase);

const router = express.Router();

router.post('/inserAdmin' , (req ,res ,next) => {controller.admin(req ,res ,next)});

router.post('/verifyLogin' , (req ,res ,next) => {controller.verifyLogin(req ,res , next)});

export default router;