import { Router } from "express";
import {
  create,
  listByVehicle
} from "../controllers/compatibilities.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authenticate, create);      // ← FIX: exige autenticação
router.get("/vehicle/:vehicleId", listByVehicle);

export default router;