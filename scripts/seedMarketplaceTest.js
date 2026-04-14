/**
 * SEED MARKETPLACE TEST
 * Cria anúncios de teste para as peças OEM reais do catálogo
 * Roda com: node scripts/seedMarketplaceTest.js
 */

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

async function seed() {
  console.log("🛒 Criando anúncios de teste para peças OEM reais...\n");

  // ── 1. Cria vendedor de teste ─────────────────────────────────────────────
  await db.collection("users").doc("seller_autostore_test").set({
    name: "AutoPeças Central",
    email: "vendedor@autostore.com.br",
    type: "seller",
    sellerVerified: true,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log("✅ Vendedor de teste criado\n");

  // ── 2. Busca todas as masterParts do catálogo ─────────────────────────────
  const masterPartsSnap = await db.collection("masterParts").get();

  if (masterPartsSnap.empty) {
    console.log("⚠️  Nenhuma masterPart encontrada. Rode os seeds primeiro.");
    process.exit(0);
  }

  console.log(`📋 ${masterPartsSnap.size} peças encontradas no catálogo.\n`);

  // ── 3. Cria um anúncio para cada masterPart ───────────────────────────────
  const BATCH_SIZE = 400;
  let batch = db.batch();
  let opCount = 0;
  let created = 0;
  let skipped = 0;

  for (const doc of masterPartsSnap.docs) {
    const part = doc.data();

    // Verifica se já existe anúncio para essa peça
    const existing = await db.collection("marketplaceParts")
      .where("masterPartId", "==", doc.id)
      .where("sellerId", "==", "seller_autostore_test")
      .limit(1)
      .get();

    if (!existing.empty) {
      skipped++;
      continue;
    }

    // Define preço baseado na categoria
    const categoryPrices = {
      cat_filtros_oleo:       { price: 49.90,  warranty: 6  },
      cat_filtros_ar:         { price: 39.90,  warranty: 6  },
      cat_filtros_combustivel:{ price: 45.90,  warranty: 6  },
      cat_filtros_cabine:     { price: 59.90,  warranty: 6  },
      cat_velas_ignicao:      { price: 89.90,  warranty: 12 },
      cat_pastilhas_freio:    { price: 129.90, warranty: 12 },
      cat_discos_freio:       { price: 189.90, warranty: 12 },
      cat_sapatas_freio:      { price: 99.90,  warranty: 12 },
      cat_amortecedores:      { price: 299.90, warranty: 12 },
      cat_rolamentos:         { price: 149.90, warranty: 12 },
      cat_correias:           { price: 79.90,  warranty: 6  },
      cat_embreagem:          { price: 399.90, warranty: 12 },
      cat_sensores:           { price: 159.90, warranty: 12 },
      cat_injetores:          { price: 249.90, warranty: 12 },
      cat_motor:              { price: 199.90, warranty: 12 },
    };

    const defaults = { price: 99.90, warranty: 6 };
    const { price, warranty } = categoryPrices[part.categoryId] || defaults;

    const mpRef = db.collection("marketplaceParts").doc();
    batch.set(mpRef, {
      sellerId:       "seller_autostore_test",
      masterPartId:   doc.id,
      price,
      stock:          Math.floor(Math.random() * 20) + 5, // 5 a 25 unidades
      condition:      "new",
      warrantyMonths: warranty,
      images:         [],
      active:         true,
      createdAt:      FieldValue.serverTimestamp(),
    });

    opCount++;
    created++;

    if (opCount >= BATCH_SIZE) {
      await batch.commit();
      console.log(`   ✅ Batch de ${opCount} anúncios commitado`);
      batch = db.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ SEED MARKETPLACE CONCLUÍDO!");
  console.log("=".repeat(50));
  console.log(`   ✅ Anúncios criados: ${created}`);
  console.log(`   ⏭️  Já existiam:     ${skipped}`);
  console.log("\n🔍 Agora teste a busca:");
  console.log("   POST /search/parts");
  console.log('   { "brand": "volkswagen", "model": "gol", "engineDisplacement": "1.0", "fuelType": "flex" }\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
