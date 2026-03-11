import { createMarketplacePartService } from "../services/marketplace.service.js";

export async function createMarketplacePart(req, res, next) {
  try {
    const files = req.files || [];

    const images = files.map((file) => `/uploads/${file.filename}`);

    const data = {
      ...req.body,
      images,
    };

    const result = await createMarketplacePartService(data);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}