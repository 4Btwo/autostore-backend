import { db } from "../src/config/firebase.js";

async function seedVehicles() {

  console.log("🚗 Criando base inicial de veículos...");

  const brands = [
    { id: "1", name: "Volkswagen" },
    { id: "2", name: "Fiat" },
    { id: "3", name: "Chevrolet" },
    { id: "4", name: "Toyota" },
    { id: "5", name: "Honda" }
  ];

  for (const brand of brands) {

    await db.collection("brands").doc(brand.id).set({
      name: brand.name,
      slug: brand.name.toLowerCase(),
      createdAt: new Date()
    });

    console.log("✔ Marca criada:", brand.name);
  }

  const models = [
    { id: "101", name: "Gol", brandId: "1" },
    { id: "102", name: "Fox", brandId: "1" },
    { id: "201", name: "Palio", brandId: "2" },
    { id: "202", name: "Uno", brandId: "2" },
    { id: "301", name: "Onix", brandId: "3" },
    { id: "401", name: "Corolla", brandId: "4" },
    { id: "501", name: "Civic", brandId: "5" }
  ];

  for (const model of models) {

    await db.collection("models").doc(model.id).set({
      name: model.name,
      brandId: model.brandId,
      slug: model.name.toLowerCase(),
      createdAt: new Date()
    });

    console.log("✔ Modelo criado:", model.name);
  }

  console.log("🔥 Base inicial criada");

}

seedVehicles();