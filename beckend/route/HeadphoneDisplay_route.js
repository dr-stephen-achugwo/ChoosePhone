import express from'express';
import  getHeadphones from'../controller/headphone_display.js';

const router = express.Router();

router.get('/', getHeadphones);

export default router;
