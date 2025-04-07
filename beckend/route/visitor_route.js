import express from "express";
import { fetchStats } from "../controller/visitor_controller.js";

const router = express.Router();

router.get("/", fetchStats);

export default router;
