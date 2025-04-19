import { Router } from 'express';
import TransactionController from './TransactionController';
import AuthMiddleware from '../../Authenticate';

const router = Router();

router.post('/:accountId/transactions', AuthMiddleware, TransactionController.createTransaction.bind(TransactionController));
router.get('/transactions/:id', AuthMiddleware, TransactionController.get.bind(TransactionController));
router.get('/:accountId/balance', AuthMiddleware, TransactionController.balance.bind(TransactionController));
router.post('/:accountId/transactions/internal', AuthMiddleware, TransactionController.createTransactionInternal.bind(TransactionController));
router.post('/:accountId/transactions/:transactionId/revert', AuthMiddleware, TransactionController.transactionReversal.bind(TransactionController));
router.get('/:accountId/transactions', AuthMiddleware, TransactionController.order.bind(TransactionController));

export default router;
