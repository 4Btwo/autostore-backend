import { lookupChassi, generateDesmancheCatalog, publishDesmancheLot } from "../services/chassi.service.js";

// GET /chassi/:vin
export async function getChassi(req, res, next) {
  try {
    const { vin } = req.params;
    const vehicle = await lookupChassi(vin);
    const catalog = await generateDesmancheCatalog(vin, vehicle);
    return res.json({
      success: true,
      data: { vehicle, catalog },
    });
  } catch (err) {
    if (err.message.includes("inválido") || err.message.includes("decodificar")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

// POST /chassi/publish
export async function publishLot(req, res, next) {
  try {
    const sellerId = req.user.uid;
    const { vin, vehicleData, selectedSubcollections } = req.body;

    if (!vin || !vehicleData || !selectedSubcollections?.length) {
      return res.status(400).json({ success: false, message: "Dados incompletos" });
    }

    const result = await publishDesmancheLot({ sellerId, vin, vehicleData, selectedSubcollections });
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
