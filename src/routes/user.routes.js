import express from "express";
import { createUserProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-profile", authenticate, createUserProfile);

export default router;