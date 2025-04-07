
// routes/phoneRoute.js
import express from'express';
import  getPhones from'../controller/Phone_display.js';

const router = express.Router();

router.get('/', getPhones);

export default router;
