import { Router } from "express";
import { create, listMyOrders, listSellerOrders, updateStatus } from "../controllers/orders.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate, createOrderSchema, updateOrderStatusSchema } from "../middlewares/validate.js";

const router = Router();

router.post("/", authenticate, validate(createOrderSchema), create);
router.get("/my", authenticate, listMyOrders);
// Retorna todos os pedidos onde o vendedor autenticado tem itens
router.get("/seller", authenticate, listSellerOrders);
router.patch("/:orderId/status", authenticate, validate(updateOrderStatusSchema), updateStatus);

export default router;
