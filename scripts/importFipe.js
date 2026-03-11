import axios from "axios";
import { db } from "../src/config/firebase.js";

const BASE_URL = "https://parallelum.com.br/fipe/api/v1/carros";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function importFipe(){

  console.log("🚗 Importando base FIPE...");

  const brandsResponse = await axios.get(`${BASE_URL}/marcas`);
  const brands = brandsResponse.data;

  console.log(`📦 ${brands.length} marcas encontradas`);

  for(const brand of brands){

    const brandId = String(brand.codigo);

    await db.collection("brands").doc(brandId).set({
      name: brand.nome,
      slug: brand.nome.toLowerCase().replace(/\s/g,"-"),
      createdAt: new Date()
    });

    console.log("✔ Marca:", brand.nome);

    await delay(500);

    const modelsResponse = await axios.get(
      `${BASE_URL}/marcas/${brand.codigo}/modelos`
    );

    const models = modelsResponse.data.modelos;

    console.log(`   📦 ${models.length} modelos`);

    for(const model of models){

      const modelId = String(model.codigo);

      await db.collection("models").doc(modelId).set({
        name: model.nome,
        brandId,
        slug: model.nome.toLowerCase().replace(/\s/g,"-"),
        createdAt: new Date()
      });

      console.log("   ↳ Modelo:", model.nome);

      await delay(500);

      const yearsResponse = await axios.get(
        `${BASE_URL}/marcas/${brand.codigo}/modelos/${model.codigo}/anos`
      );

      const years = yearsResponse.data;

      for(const year of years){

        await db.collection("vehicleTechnicals").add({
          brandId,
          modelId,
          year: year.nome,
          fipeCode: year.codigo,
          createdAt: new Date()
        });

        console.log("      ↳ Ano:", year.nome);

      }

      await delay(500);

    }

  }

  console.log("🔥 Importação finalizada");

}

importFipe();