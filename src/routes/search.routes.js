import { Router } from "express";
import { searchParts } from "../controllers/search.controller.js";

const router = Router();

router.post("/parts", searchParts);

export default router;