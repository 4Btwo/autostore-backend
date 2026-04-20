import express from "express";
import { chat } from "../controllers/agent.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { agentLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

/**
 * POST /agent/chat
 * Body: { message: string, history?: Array<{role: string, content: string}> }
 * Headers: Authorization: Bearer <firebase_token>
 *
 * Retorna: { success: true, data: { reply: string, profile: string } }
 */
router.post("/chat", authenticate, agentLimiter, chat);

export default router;
