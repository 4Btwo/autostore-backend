import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadImage } from "../services/cloudinary.service.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import AppError from "../errors/AppError.js";

const router = express.Router();

// POST /upload — envia imagem para o Cloudinary e retorna a URL pública
router.post("/", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Nenhum arquivo enviado", 400, "NO_FILE");
    }

    const { url, publicId } = await uploadImage(req.file.buffer, "misc");

    res.json({
      success: true,
      url,
      publicId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;