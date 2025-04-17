import { Router } from 'express';
import UserController from './UserController';
import AuthMiddleware from '../../Authenticate';

const router = Router();

router.post('/people', UserController.createUser.bind(UserController));
router.post('/login', UserController.login.bind(UserController));
router.get('/:id', AuthMiddleware, UserController.get.bind(UserController));
// router.get('/order', AuthMiddleware, UserController.order.bind(UserController));

export default router;
