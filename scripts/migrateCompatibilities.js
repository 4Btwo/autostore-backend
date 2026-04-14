import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config();

const keyPath = resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
const sa = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

function normalize(text) {
  return text?.toString().toLowerCase().trim() ?? "";
}

function extractDisplacement(engine) {
  const match = normalize(engine).match(/^[\d.]+/);
  return match ? match[0] : normalize(engine);
}

async function migrate() {
  console.log("🔄 Iniciando migração de compatibilities...\n");

  const snapshot = await db.collection("compatibilities").get();

  if (snapshot.empty) {
    console.log("⚠️  Nenhum documento encontrado em compatibilities.");
    console.log("   Execute os seeds primeiro (seedMahle.js, seedNGK.js, etc.)");
    process.exit(0);
  }

  console.log(`📋 ${snapshot.size} documentos encontrados.\n`);

  const BATCH_SIZE = 400;
  let batch = db.batch();
  let opCount = 0;
  let migrated = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (data.brandSlug && data.modelSlug && data.engineDisplacement && data.fuelNorm) {
      skipped++;
      continue;
    }

    if (!data.brand || !data.model) {
      console.log(`   ⚠️  Pulando ${doc.id} — sem brand ou model`);
      skipped++;
      continue;
    }

    const brandSlug = normalize(data.brand);
    const modelSlug = normalize(data.model);
    const engineDisplacement = extractDisplacement(data.engine || "");
    const fuelNorm = normalize(data.fuel || "");

    batch.update(doc.ref, {
      brandSlug,
      modelSlug,
      engineDisplacement,
      fuelNorm,
      migratedAt: FieldValue.serverTimestamp(),
    });

    opCount++;
    migrated++;

    if (opCount >= BATCH_SIZE) {
      await batch.commit();
      console.log(`   ✅ Batch de ${opCount} documentos commitado`);
      batch = db.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ MIGRAÇÃO CONCLUÍDA!");
  console.log("=".repeat(50));
  console.log(`   ✅ Migrados:  ${migrated}`);
  console.log(`   ⏭️  Pulados:   ${skipped} (já migrados ou inválidos)`);
  console.log("\n🔍 Agora a busca funcionará com:");
  console.log("   brand=volkswagen | model=gol | engine=1.0 | fuel=flex\n");

  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Erro na migração:", err);
  process.exit(1);
});