/**
 * SCRIPT DE SEED — PopulaFirebase com dados de teste
 * 
 * Roda com: node --env-file=.env scripts/seedTest.js
 * 
 * Cria:
 * - 1 marca (Volkswagen)
 * - 2 categorias (Filtros, Freios)
 * - 1 modelo (Gol)
 * - 1 vehicleTechnical (Gol 1.0 Flex)
 * - 3 masterParts (peças OEM)
 * - 3 technicalCompatibilities
 * - 3 marketplaceParts (à venda)
 * - 1 usuário vendedor de teste
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

// Init Firebase
const keyPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  console.log("🌱 Iniciando seed de dados de teste...\n");

  // ── 1. MARCA ──────────────────────────────────────────────────────────────
  console.log("📌 Criando marca Volkswagen...");
  const brandRef = db.collection("brands").doc("brand_vw");
  await brandRef.set({
    name: "Volkswagen",
    slug: "volkswagen",
    country: "Alemanha",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("   ✅ brands/brand_vw");

  // ── 2. CATEGORIAS ─────────────────────────────────────────────────────────
  console.log("\n📌 Criando categorias...");
  await db.collection("categories").doc("cat_filtros").set({
    name: "Filtros",
    slug: "filtros",
    active: true,
  });
  await db.collection("categories").doc("cat_freios").set({
    name: "Freios",
    slug: "freios",
    active: true,
  });
  await db.collection("categories").doc("cat_motor").set({
    name: "Motor",
    slug: "motor",
    active: true,
  });
  console.log("   ✅ categories: filtros, freios, motor");

  // ── 3. MODELO ─────────────────────────────────────────────────────────────
  console.log("\n📌 Criando modelo Gol...");
  await db.collection("models").doc("model_gol").set({
    name: "Gol",
    slug: "gol",
    brandId: "brand_vw",
    active: true,
  });
  console.log("   ✅ models/model_gol");

  // ── 4. VEHICLE TECHNICAL ──────────────────────────────────────────────────
  console.log("\n📌 Criando vehicleTechnical (Gol 1.0 Flex 2015-2022)...");
  await db.collection("vehicleTechnicals").doc("vt_gol_10_flex").set({
    brandId: "brand_vw",
    modelId: "model_gol",
    engineDisplacement: "1.0",
    fuelType: "flex",
    transmission: "manual",
    yearStart: 2015,
    yearEnd: 2022,
    platform: "MQB",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("   ✅ vehicleTechnicals/vt_gol_10_flex");

  // ── 5. MASTER PARTS (catálogo OEM) ────────────────────────────────────────
  console.log("\n📌 Criando masterParts (catálogo OEM)...");

  await db.collection("masterParts").doc("mp_filtro_oleo").set({
    name: "Filtro de Óleo",
    oemNumber: "WHR-198-993",
    brandId: "brand_vw",
    categoryId: "cat_filtros",
    description: "Filtro de óleo original para motores 1.0 e 1.6 Flex",
    images: [],
    weightKg: 0.3,
    dimensions: { height: 8, width: 8, length: 8 },
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("masterParts").doc("mp_pastilha_freio").set({
    name: "Pastilha de Freio Dianteira",
    oemNumber: "GDB-1813",
    brandId: "brand_vw",
    categoryId: "cat_freios",
    description: "Jogo de pastilhas de freio dianteiras para Gol, Voyage e Fox",
    images: [],
    weightKg: 0.8,
    dimensions: { height: 3, width: 12, length: 6 },
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("masterParts").doc("mp_vela_ignicao").set({
    name: "Vela de Ignição",
    oemNumber: "NGK-BKR5EIX",
    brandId: "brand_vw",
    categoryId: "cat_motor",
    description: "Vela de ignição iridium para motores 1.0 Flex (jogo com 4 unidades)",
    images: [],
    weightKg: 0.2,
    dimensions: { height: 10, width: 3, length: 3 },
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("   ✅ masterParts: filtro óleo, pastilha freio, vela ignição");

  // ── 6. TECHNICAL COMPATIBILITIES ─────────────────────────────────────────
  console.log("\n📌 Criando technicalCompatibilities...");

  await db.collection("technicalCompatibilities").doc("tc_filtro_gol").set({
    vehicleTechnicalId: "vt_gol_10_flex",
    masterPartId: "mp_filtro_oleo",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("technicalCompatibilities").doc("tc_pastilha_gol").set({
    vehicleTechnicalId: "vt_gol_10_flex",
    masterPartId: "mp_pastilha_freio",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("technicalCompatibilities").doc("tc_vela_gol").set({
    vehicleTechnicalId: "vt_gol_10_flex",
    masterPartId: "mp_vela_ignicao",
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("   ✅ technicalCompatibilities: 3 compatibilidades criadas");

  // ── 7. VENDEDOR DE TESTE ──────────────────────────────────────────────────
  console.log("\n📌 Criando usuário vendedor de teste...");
  await db.collection("users").doc("seller_test_001").set({
    name: "AutoPeças Silva",
    email: "vendedor@autostore.test",
    type: "seller",
    sellerVerified: true,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("   ✅ users/seller_test_001");

  // ── 8. MARKETPLACE PARTS (peças à venda) ──────────────────────────────────
  console.log("\n📌 Criando marketplaceParts (peças à venda)...");

  await db.collection("marketplaceParts").doc("mkp_filtro_novo").set({
    sellerId: "seller_test_001",
    masterPartId: "mp_filtro_oleo",
    price: 45.90,
    stock: 15,
    condition: "new",
    warrantyMonths: 6,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("marketplaceParts").doc("mkp_pastilha_nova").set({
    sellerId: "seller_test_001",
    masterPartId: "mp_pastilha_freio",
    price: 89.90,
    stock: 8,
    condition: "new",
    warrantyMonths: 12,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("marketplaceParts").doc("mkp_pastilha_usada").set({
    sellerId: "seller_test_001",
    masterPartId: "mp_pastilha_freio",
    price: 39.90,
    stock: 3,
    condition: "used",
    warrantyMonths: 0,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("marketplaceParts").doc("mkp_vela_nova").set({
    sellerId: "seller_test_001",
    masterPartId: "mp_vela_ignicao",
    price: 120.00,
    stock: 20,
    condition: "new",
    warrantyMonths: 12,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("   ✅ marketplaceParts: 4 peças criadas");

  // ── RESUMO ────────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(50));
  console.log("✅ SEED CONCLUÍDO COM SUCESSO!");
  console.log("=".repeat(50));
  console.log("\n📋 Para testar a busca manual use:");
  console.log("   Marca:       volkswagen");
  console.log("   Modelo:      gol");
  console.log("   Motor:       1.0");
  console.log("   Combustível: flex");
  console.log("\n🛒 Peças no marketplace:");
  console.log("   - Filtro de Óleo WHR-198-993 → R$ 45,90");
  console.log("   - Pastilha de Freio GDB-1813 → R$ 89,90 (nova) / R$ 39,90 (usada)");
  console.log("   - Vela de Ignição NGK-BKR5EIX → R$ 120,00");
  console.log("\n💳 Agora adicione ao carrinho e teste o Mercado Pago!\n");

  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
