// routes/WashingmachineRoutes.js
import express from 'express';
import { createWashingmachine ,updateWashingmachine ,deleteWashingmachine } from '../controller/AddWashingmachine_display.js';

const router = express.Router();

// POST route to create Washingmachine entry
router.post('/WashingMachine', createWashingmachine);
router.put('/WashingMachine/:WashingmachineId', updateWashingmachine);
router.post("/WashingMachine/delete", deleteWashingmachine);


export default router;
