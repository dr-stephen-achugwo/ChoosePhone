
// routes/phoneRoute.js
import express from'express';
import  getSmartwatches from'../controller/smartwatch_display.js';

const router = express.Router();

router.get('/', getSmartwatches);

export default router;
