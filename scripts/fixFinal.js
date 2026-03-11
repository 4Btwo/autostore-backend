/**
 * FIX FINAL — Corrige vehicleTechnical com IDs reais
 * Roda com: node --env-file=.env scripts/fixFinal.js
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
  // 1. IDs reais confirmados nos logs
  const BRAND_ID = "UZd0AsjcRaIXKA83D8Cz";  // Volkswagen real
  const MODEL_ID = "GcgWSWdU11RdTHdwQEtt";   // Gol real

  console.log("🔍 Verificando vehicleTechnicals existentes...");
  const vtSnap = await db.collection("vehicleTechnicals").get();
  vtSnap.docs.forEach(doc => {
    const d = doc.data();
    console.log(`ID: ${doc.id} | brandId: ${d.brandId} | modelId: ${d.modelId} | engine: ${d.engineDisplacement} | fuel: ${d.fuelType} | active: ${d.active}`);
  });

  // 2. Deletar todos vehicleTechnicals com IDs errados
  console.log("\n🗑️  Deletando vehicleTechnicals com IDs errados...");
  for (const doc of vtSnap.docs) {
    const d = doc.data();
    if (d.brandId !== BRAND_ID || d.modelId !== MODEL_ID) {
      await db.collection("vehicleTechnicals").doc(doc.id).delete();
      console.log(`   ✅ Deletado: ${doc.id}`);
    } else {
      console.log(`   ⏭️  Mantido (já correto): ${doc.id}`);
    }
  }

  // 3. Criar vehicleTechnical com IDs corretos
  console.log("\n📌 Criando vehicleTechnical correto...");
  const vtRef = await db.collection("vehicleTechnicals").add({
    brandId: BRAND_ID,
    modelId: MODEL_ID,
    engineDisplacement: "1.0",
    fuelType: "flex",
    transmission: "manual",
    yearStart: 2015,
    yearEnd: 2022,
    platform: "MQB",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`   ✅ Criado: ${vtRef.id} com brandId=${BRAND_ID} modelId=${MODEL_ID}`);

  // 4. Deletar compatibilidades antigas
  console.log("\n🗑️  Deletando compatibilidades antigas...");
  const compSnap = await db.collection("technicalCompatibilities").get();
  for (const doc of compSnap.docs) {
    await doc.ref.delete();
    console.log(`   ✅ Deletado: ${doc.id}`);
  }

  // 5. Recriar compatibilidades com ID correto
  console.log("\n📌 Recriando compatibilidades...");
  const masterParts = ["mp_filtro_oleo", "mp_pastilha_freio", "mp_vela_ignicao"];
  for (const masterPartId of masterParts) {
    const ref = await db.collection("technicalCompatibilities").add({
      vehicleTechnicalId: vtRef.id,
      masterPartId,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`   ✅ ${ref.id} → ${vtRef.id} → ${masterPartId}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ CORREÇÃO CONCLUÍDA!");
  console.log("=".repeat(50));
  console.log("\nAgora teste a busca com:");
  console.log("   Marca: volkswagen | Modelo: gol | Motor: 1.0 | Combustível: flex\n");

  process.exit(0);
}

fix().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
