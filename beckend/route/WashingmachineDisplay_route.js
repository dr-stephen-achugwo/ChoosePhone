import express from'express';
import  getWashingmachine from'../controller/washingmachine_display.js';

const router = express.Router();

router.get('/', getWashingmachine);

export default router;
