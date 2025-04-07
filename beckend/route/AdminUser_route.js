import express from 'express';
import { register, login, setup2FA, verify2FA } from '../controller/AdminUser_controler.js';
import { authenticateAdmin } from '../middleware/Auth_middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/setup-2fa', authenticateAdmin, setup2FA);
router.post('/verify-2fa', verify2FA);

export default router;
