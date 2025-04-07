import express from'express';
import  getCamera from '../controller/camera_display.js' ;

const router = express.Router();

router.get('/', getCamera);

export default router;
