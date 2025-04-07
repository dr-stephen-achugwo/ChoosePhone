import express from 'express';
import { signInUser } from '../controller/AdminSignin_controller.js';

const router = express.Router();

// Route for admin sign-in
router.post('/signin', signInUser);

export default router;
