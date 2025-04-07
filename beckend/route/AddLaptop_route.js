// routes/LaptopRoutes.js
import express from 'express';
import { createLaptop ,updateLaptop ,deleteLaptop } from '../controller/AddLaptop_display.js';

const router = express.Router();

// POST route to create Laptop entry
router.post('/laptops', createLaptop);
router.put('/laptops/update', updateLaptop);
router.post("/laptops/delete", deleteLaptop);


export default router;
