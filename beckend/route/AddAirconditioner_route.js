// routes/AirConditionRoutes.js
import express from 'express';
import { createAirCondition ,updateAirCondition ,deleteAirCondition } from '../controller/AddAirconditioner_display.js';

const router = express.Router();

// POST route to create AirCondition entry
router.post('/AirCondition', createAirCondition);
router.put('/AirCondition/:AirConditionId', updateAirCondition);
router.post("/AirCondition/delete", deleteAirCondition);


export default router;
