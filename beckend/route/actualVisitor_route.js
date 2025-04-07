import express from "express";
import { trackVisitor, getTotalVisitors } from "../controller/actualVisitor_controller.js";

const router = express.Router();

router.post("/", trackVisitor);
router.get("/total", getTotalVisitors);

export default router;
