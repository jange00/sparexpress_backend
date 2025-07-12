import express from 'express';
import { initiateEsewaPayment, verifyEsewaPayment } from '../controllers/esewaController.js';
import { authenticateUser } from '../middlewares/authorizedUser.js'; 

const router = express.Router();

// POST /api/payment/esewa/initiate
router.post('/esewa/initiate', authenticateUser, initiateEsewaPayment);

// GET /api/payment/esewa/verify
router.get('/esewa/verify', verifyEsewaPayment); 

export default router;