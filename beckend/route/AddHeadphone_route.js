// routes/HeadphoneRoutes.js
import express from 'express';
import { createHeadphone ,updateHeadphone ,deleteHeadphone } from '../controller/AddHeadphone_display.js';

const router = express.Router();

// POST route to create Headphone entry
router.post('/Headphones', createHeadphone);
router.put('/Headphones/:HeadphoneId', updateHeadphone);
router.post("/Headphones/delete", deleteHeadphone);


export default router;
