import { Router } from "express";
import { create, listMyOrders, updateStatus } from "../controllers/orders.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// Criar pedido (comprador autenticado)
router.post("/", authenticate, create);

// Listar meus pedidos
router.get("/my", authenticate, listMyOrders);

// Atualizar status (vendedor/admin)
router.patch("/:orderId/status", authenticate, updateStatus);

export default router;
