import express from'express';
import  getTablets from'../controller/tablet_display.js';

const router = express.Router();

router.get('/', getTablets);

export default router;
