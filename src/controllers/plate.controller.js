import { getVehicleByPlate } from "../services/plate.service.js";
import { findPartsByVehicle } from "../services/parts.service.js";

export const searchByPlate = async (req, res) => {

  try {

    const { plate } = req.body;

    if (!plate) {
      return res.status(400).json({
        success:false,
        message:"Placa obrigatória"
      });
    }

    // 1 buscar dados do carro
    const vehicle = await getVehicleByPlate(plate);

    if(!vehicle){
      return res.status(404).json({
        success:false,
        message:"Veículo não encontrado"
      });
    }

    // 2 buscar peças
    const parts = await findPartsByVehicle(vehicle);

    return res.json({
      success:true,
      vehicle,
      parts
    });

  } catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Erro interno"
    });

  }

};