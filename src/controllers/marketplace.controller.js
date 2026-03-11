import { createMarketplacePartService, updateMarketplacePartImages } from "../services/marketplace.service.js";
import { uploadImage } from "../services/cloudinary.service.js";
import { successResponse } from "../utils/response.js";

export async function createMarketplacePart(req, res, next) {
  try {
    const files = req.files || [];

    // Faz upload de cada imagem para o Cloudinary
    const imageUploads = await Promise.all(
      files.map(file => uploadImage(file.buffer, "parts"))
    );
    const images = imageUploads.map(img => img.url);

    const result = await createMarketplacePartService({
      ...req.body,
      images,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

// PATCH /marketplaceParts/:id/images — atualizar fotos de uma peça existente
export async function updatePartImages(req, res, next) {
  try {
    const { id } = req.params;
    const sellerId = req.user.uid;
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ success: false, message: "Nenhuma imagem enviada" });
    }

    const imageUploads = await Promise.all(
      files.map(file => uploadImage(file.buffer, "parts"))
    );
    const newImages = imageUploads.map(img => img.url);

    const result = await updateMarketplacePartImages(id, sellerId, newImages);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
}
