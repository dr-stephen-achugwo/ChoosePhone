import express from 'express';
import { signin, signup, google, signout } from '../controller/auth_controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);

export default router;