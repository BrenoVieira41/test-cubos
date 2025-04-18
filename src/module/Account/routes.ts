import { Router } from 'express';
import AuthMiddleware from '../../Authenticate';
import AccountController from './AccountController';

const router = Router();

router.post('/', AuthMiddleware, AccountController.createAccount.bind(AccountController));
router.get('/', AuthMiddleware, AccountController.getAccount.bind(AccountController));

export default router;
