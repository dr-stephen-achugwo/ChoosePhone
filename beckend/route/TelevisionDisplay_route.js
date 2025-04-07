import express from'express';
import  getTelevisions from'../controller/televisions_display.js';

const router = express.Router();

router.get('/', getTelevisions);

export default router;
