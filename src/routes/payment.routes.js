import { Router } from "express";
import { createPayment, webhook, getPaymentStatus } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// Criar preferência de pagamento (comprador autenticado)
router.post("/create", authenticate, createPayment);

// Webhook do Mercado Pago (sem autenticação — vem do MP)
router.post("/webhook", webhook);

// Consultar status do pagamento
router.get("/status/:orderId", authenticate, getPaymentStatus);

export default router;
