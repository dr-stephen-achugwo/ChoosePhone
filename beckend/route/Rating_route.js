import express from 'express';
import { getRatings } from '../controller/Rating_controller.js';

const router = express.Router();

router.get('/ratings', getRatings);

export default router;
