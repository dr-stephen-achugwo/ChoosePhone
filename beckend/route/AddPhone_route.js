// routes/phoneRoutes.js
import express from 'express';
import { createPhone ,updatePhone ,deletePhone } from '../controller/AddPhone_display.js';

const router = express.Router();

// POST route to create phone entry
router.post('/phones', createPhone);
router.put('/phones/:phoneId', updatePhone);
router.post("/phones/delete", deletePhone);


export default router;
