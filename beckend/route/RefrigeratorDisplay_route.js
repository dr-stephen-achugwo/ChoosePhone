
// routes/phoneRoute.js
import express from'express';
import  getRefrigerators from'../controller/refrigerators_display.js';

const router = express.Router();

router.get('/', getRefrigerators);

export default router;
