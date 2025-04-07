import express from'express';
import  getAirConditioner from '../controller/airconditioner_display.js' ;

const router = express.Router();

router.get('/', getAirConditioner);

export default router;
