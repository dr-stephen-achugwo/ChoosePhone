// routes/TabletRoutes.js
import express from 'express';
import { createTablet ,updateTablet ,deleteTablet } from '../controller/AddTablet_display.js';

const router = express.Router();

// POST route to create Tablet entry
router.post('/Tablets', createTablet);
router.put('/Tablets/:TabletId', updateTablet);
router.post("/Tablets/delete", deleteTablet);


export default router;
