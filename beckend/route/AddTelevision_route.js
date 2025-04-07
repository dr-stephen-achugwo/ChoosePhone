// routes/TelevisionRoutes.js
import express from 'express';
import { createTelevision ,updateTelevision ,deleteTelevision } from '../controller/AddTelevision_display.js';

const router = express.Router();

// POST route to create Television entry
router.post('/Televisions', createTelevision);
router.put('/Televisions/:TelevisionId', updateTelevision);
router.post("/televisions/delete", deleteTelevision);


export default router;
