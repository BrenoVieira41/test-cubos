import { Router } from 'express';
import CardController from './CardController';
import AuthMiddleware from '../../Authenticate';

const router = Router();

router.post('/accounts/:accountId/cards', AuthMiddleware, CardController.createCard.bind(CardController));
router.get('/accounts/:accountId/cards', AuthMiddleware, CardController.list.bind(CardController));
router.get('/accounts/cards', AuthMiddleware, CardController.get.bind(CardController));
router.get('/cards', AuthMiddleware, CardController.order.bind(CardController));

export default router;
