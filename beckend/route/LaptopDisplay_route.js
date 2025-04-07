import express from'express';
import  getLaptops from '../controller/laptop_display.js' ;

const router = express.Router();

router.get('/', getLaptops);

export default router;
