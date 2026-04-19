import express from "express";
import { chat } from "../controllers/agent.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * POST /agent/chat
 * Body: { message: string }
 * Headers: Authorization: Bearer <firebase_token>
 *
 * Retorna: { success: true, data: { reply: string, profile: string } }
 */
router.post("/chat", authenticate, chat);

export default router;
