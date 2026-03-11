//import axios from "axios";

//export const getVehicleByPlate = async (plate) => {

 // const response = await axios.get(
   // `https://api.placa.example/${plate}`
//  );

 // return {
//    brand: response.data.brand,
    // model: response.data.model,
   // year: response.data.year
 // };

//};

export const getVehicleByPlate = async (plate) => {

  console.log("Buscando placa:", plate);

  // SIMULA retorno de API de placa
  return {
    plate: plate,
    brand: "Volkswagen",
    model: "Gol",
    year: 2019
  };

};