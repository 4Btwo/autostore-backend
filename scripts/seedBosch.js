/**
 * SEED BOSCH — Sensores Lambda, Detonação, Rotação + Bombas de Combustível
 * Fonte: Catálogo Bosch Brasil + referências cruzadas
 * Roda com: node scripts/seedBosch.js
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

const pecas = [

  // ── SENSORES LAMBDA / SONDA LAMBDA ───────────────────────────────────────
  {
    categoryId: "cat_sensores", categoryName: "Sensores",
    oemNumber: "BOSCH-0258006577",
    name: "Sonda Lambda Bosch 0258006577",
    description: "Sensor de oxigênio (sonda lambda) pré-catalisador para Fiat Fire e Firefly Flex.",
    brand: "Bosch", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  {
    categoryId: "cat_sensores", categoryName: "Sensores",
    oemNumber: "BOSCH-0258006171",
    name: "Sonda Lambda Bosch 0258006171",
    description: "Sensor de oxigênio pré-catalisador para VW EA111 1.0 e 1.6 Flex.",
    brand: "Bosch", weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2006 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
    ],
  },
  {
    categoryId: "cat_sensores", categoryName: "Sensores",
    oemNumber: "BOSCH-0258006227",
    name: "Sonda Lambda Bosch 0258006227",
    description: "Sensor de oxigênio para GM Onix, Prisma, Cobalt 1.0/1.4 Flex.",
    brand: "Bosch", weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
    ],
  },

  // ── SENSORES DE DETONAÇÃO ─────────────────────────────────────────────────
  {
    categoryId: "cat_sensores", categoryName: "Sensores",
    oemNumber: "BOSCH-0261231176",
    name: "Sensor de Detonação Bosch 0261231176",
    description: "Sensor de detonação (knock sensor) original Fiat e GM. Cobre ampla gama de modelos.",
    brand: "Bosch", weightKg: 0.1,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 / 1.6 / 1.8 Flex", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_sensores", categoryName: "Sensores",
    oemNumber: "BOSCH-0261231188",
    name: "Sensor de Detonação Bosch 0261231188",
    description: "Sensor de detonação para VW EA111 e EA211 Flex.",
    brand: "Bosch", weightKg: 0.1,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 / EA211 Flex", fuel: "Flex", yearFrom: 2003, yearTo: null },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },

  // ── SENSORES DE ROTAÇÃO ───────────────────────────────────────────────────
  {
    categoryId: "cat_sensores", categoryName: "Sensores",
    oemNumber: "BOSCH-0261210259",
    name: "Sensor de Rotação Bosch 0261210259",
    description: "Sensor de posição do virabrequim (CKP) para Fiat Fire e Firefly.",
    brand: "Bosch", weightKg: 0.1,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 / 1.6 / 1.8 Flex", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },

  // ── BOMBAS DE COMBUSTÍVEL ─────────────────────────────────────────────────
  {
    categoryId: "cat_bombas_combustivel", categoryName: "Bombas de Combustível",
    oemNumber: "BOSCH-0580313052",
    name: "Bomba de Combustível Bosch 0580313052",
    description: "Bomba de combustível interna (modular) para Fiat Fire e Firefly Flex.",
    brand: "Bosch", weightKg: 0.5,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },
  {
    categoryId: "cat_bombas_combustivel", categoryName: "Bombas de Combustível",
    oemNumber: "BOSCH-0580313074",
    name: "Bomba de Combustível Bosch 0580313074",
    description: "Bomba de combustível modular para VW EA111 1.0 e 1.6 Flex.",
    brand: "Bosch", weightKg: 0.5,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2006 },
    ],
  },
  {
    categoryId: "cat_bombas_combustivel", categoryName: "Bombas de Combustível",
    oemNumber: "BOSCH-0580313098",
    name: "Bomba de Combustível Bosch 0580313098",
    description: "Bomba de combustível modular para GM Onix, Prisma, Cobalt Flex.",
    brand: "Bosch", weightKg: 0.5,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_bombas_combustivel", categoryName: "Bombas de Combustível",
    oemNumber: "BOSCH-0580313065",
    name: "Bomba de Combustível Bosch 0580313065",
    description: "Bomba de combustível para Honda Fit, City e WR-V 1.5 Flex.",
    brand: "Bosch", weightKg: 0.5,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },
  {
    categoryId: "cat_bombas_combustivel", categoryName: "Bombas de Combustível",
    oemNumber: "BOSCH-0580313041",
    name: "Bomba de Combustível Bosch 0580313041",
    description: "Bomba de combustível para Renault Sandero, Logan e Kwid Flex.",
    brand: "Bosch", weightKg: 0.5,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },

  // ── FILTROS DE COMBUSTÍVEL ────────────────────────────────────────────────
  {
    categoryId: "cat_filtros_combustivel", categoryName: "Filtros de Combustível",
    oemNumber: "BOSCH-F026402056",
    name: "Filtro de Combustível Bosch F026402056",
    description: "Filtro de combustível para Fiat Fire e Firefly Flex. Substitui 71736159.",
    brand: "Bosch", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_combustivel", categoryName: "Filtros de Combustível",
    oemNumber: "BOSCH-F026402062",
    name: "Filtro de Combustível Bosch F026402062",
    description: "Filtro de combustível para VW EA111 e EA211 Flex — Gol, Fox, Polo.",
    brand: "Bosch", weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 / EA211 Flex", fuel: "Flex", yearFrom: 2003, yearTo: null },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },
];

// Garante todas as categorias novas
const categorias = {
  cat_sensores: { name: "Sensores", icon: "📡" },
  cat_bombas_combustivel: { name: "Bombas de Combustível", icon: "⛽" },
  cat_filtros_combustivel: { name: "Filtros de Combustível", icon: "🔋" },
};

async function seed() {
  console.log("🚀 Iniciando seed Bosch Sensores + Bombas + Filtros...\n");

  for (const [id, cat] of Object.entries(categorias)) {
    await db.collection("categories").doc(id).set({ ...cat, active: true }, { merge: true });
    console.log(`✅ Categoria: ${cat.name}`);
  }

  let masterCount = 0, compatCount = 0;
  for (const item of pecas) {
    const { applications, categoryId, categoryName, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({ ...partData, categoryId, categoryName, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    masterCount++;
    console.log(`  ✅ ${item.oemNumber}`);
    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({ masterPartId: masterRef.id, oemNumber: item.oemNumber, brand: app.brand, model: app.model, engine: app.engine, fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }
  console.log(`\n🎉 Seed concluído! ${masterCount} peças | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
