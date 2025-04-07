// routes/CameraRoutes.js
import express from 'express';
import { createCamera ,updateCamera ,deleteCamera } from '../controller/AddCamera_display.js';

const router = express.Router();

// POST route to create Camera entry
router.post('/Camera', createCamera);
router.put('/Camera/:CameraId', updateCamera);
router.post("/Camera/delete", deleteCamera);


export default router;
