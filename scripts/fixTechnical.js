/**
 * SCRIPT DE CORREÇÃO — Recria vehicleTechnical e compatibilidades
 * usando os IDs reais já existentes no Firestore
 * 
 * Roda com: node --env-file=.env scripts/fixTechnical.js
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const keyPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function fix() {
  console.log("🔧 Corrigindo IDs do vehicleTechnical...\n");

  // 1. Buscar a marca Volkswagen real
  const brandSnap = await db.collection("brands").where("slug", "==", "volkswagen").get();
  if (brandSnap.empty) { console.error("❌ Marca volkswagen não encontrada!"); process.exit(1); }
  const brand = { id: brandSnap.docs[0].id, ...brandSnap.docs[0].data() };
  console.log("✅ Marca encontrada:", brand.id, brand.name);

  // 2. Buscar o modelo Gol real
  const modelSnap = await db.collection("models").where("slug", "==", "gol").where("brandId", "==", brand.id).get();
  if (modelSnap.empty) { console.error("❌ Modelo gol não encontrado!"); process.exit(1); }
  const model = { id: modelSnap.docs[0].id, ...modelSnap.docs[0].data() };
  console.log("✅ Modelo encontrado:", model.id, model.name);

  // 3. Deletar vehicleTechnical antigo (com IDs errados)
  console.log("\n🗑️  Removendo vehicleTechnical antigo...");
  await db.collection("vehicleTechnicals").doc("vt_gol_10_flex").delete();
  console.log("   ✅ Removido");

  // 4. Recriar com IDs corretos
  console.log("\n📌 Criando vehicleTechnical com IDs corretos...");
  const vtRef = await db.collection("vehicleTechnicals").add({
    brandId: brand.id,
    modelId: model.id,
    engineDisplacement: "1.0",
    fuelType: "flex",
    transmission: "manual",
    yearStart: 2015,
    yearEnd: 2022,
    platform: "MQB",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("   ✅ vehicleTechnicals/" + vtRef.id);

  // 5. Deletar compatibilidades antigas
  console.log("\n🗑️  Removendo compatibilidades antigas...");
  await db.collection("technicalCompatibilities").doc("tc_filtro_gol").delete();
  await db.collection("technicalCompatibilities").doc("tc_pastilha_gol").delete();
  await db.collection("technicalCompatibilities").doc("tc_vela_gol").delete();
  console.log("   ✅ Removidas");

  // 6. Recriar compatibilidades com ID correto do vehicleTechnical
  console.log("\n📌 Criando compatibilidades com ID correto...");
  await db.collection("technicalCompatibilities").add({
    vehicleTechnicalId: vtRef.id,
    masterPartId: "mp_filtro_oleo",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await db.collection("technicalCompatibilities").add({
    vehicleTechnicalId: vtRef.id,
    masterPartId: "mp_pastilha_freio",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await db.collection("technicalCompatibilities").add({
    vehicleTechnicalId: vtRef.id,
    masterPartId: "mp_vela_ignicao",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("   ✅ 3 compatibilidades criadas");

  console.log("\n" + "=".repeat(50));
  console.log("✅ CORREÇÃO CONCLUÍDA!");
  console.log("=".repeat(50));
  console.log("\nAgora teste a busca manual com:");
  console.log("   Marca:       volkswagen");
  console.log("   Modelo:      gol");
  console.log("   Motor:       1.0");
  console.log("   Combustível: flex\n");

  process.exit(0);
}

fix().catch(err => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
