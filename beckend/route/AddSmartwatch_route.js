// routes/SmartwatchesRoutes.js
import express from 'express';
import { createSmartwatches ,updateSmartwatches ,deleteSmartwatches } from '../controller/AddSmartwatch_display.js';

const router = express.Router();

// POST route to create Smartwatches entry
router.post('/smartwatches', createSmartwatches);
router.put('/smartwatches/:SmartwatchesId', updateSmartwatches);
router.post("/smartwatches/delete", deleteSmartwatches);


export default router;
