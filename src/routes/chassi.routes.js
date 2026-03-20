import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getChassi, publishLot } from "../controllers/chassi.controller.js";

const router = express.Router();

// GET /chassi/:vin — consulta VIN e retorna catálogo (autenticado)
router.get("/:vin", authMiddleware, getChassi);

// POST /chassi/publish — publica anúncios em lote (vendedor autenticado)
router.post("/publish", authMiddleware, publishLot);

export default router;
