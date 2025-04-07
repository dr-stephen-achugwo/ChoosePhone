// routes/RefrigeratorRoutes.js
import express from 'express';
import { createRefrigerator ,updateRefrigerator ,deleteRefrigerator } from '../controller/AddRefrigerator_display.js';

const router = express.Router();

// POST route to create Refrigerator entry
router.post('/Refrigerator', createRefrigerator);
router.put('/Refrigerator/:RefrigeratorId', updateRefrigerator);
router.post("/Refrigerator/delete", deleteRefrigerator);


export default router;
