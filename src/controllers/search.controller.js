import { executeSearch } from "../services/search.service.js";

export async function searchParts(req, res, next) {
  try {
    const { plate, ...manualData } = req.body;

    let vehicleData;

    if (plate) {
  vehicleData = {
    brand: "volkswagen",
    model: "gol",
    engineDisplacement: "1.0",
    fuelType: "flex",
  };
    } else {
      vehicleData = manualData;
    }

    const results = await executeSearch(vehicleData);

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}