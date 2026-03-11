import express from "express";
import { searchByPlate } from "../controllers/plate.controller.js";

const router = express.Router();

router.post("/", searchByPlate);

export default router;