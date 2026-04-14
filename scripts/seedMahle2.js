/**
 * SEED MAHLE2 — Filtros de Ar Motor + Filtros de Cabine (Ar Condicionado)
 * Fonte: Catálogo Mahle Metal Leve Brasil
 * Roda com: node scripts/seedMahle2.js
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
  // ── FILTROS DE AR MOTOR ───────────────────────────────────────────────────
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX2057",
    name: "Filtro de Ar Mahle LX2057",
    description: "Filtro de ar motor para Fiat Fire e Firefly 1.0, 1.3 e 1.4 Flex.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2006, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2006, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX1657",
    name: "Filtro de Ar Mahle LX1657",
    description: "Filtro de ar motor para VW EA111 1.0 e 1.6 Flex — Gol, Fox, Voyage.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX2769",
    name: "Filtro de Ar Mahle LX2769",
    description: "Filtro de ar motor para VW Polo, Virtus, T-Cross EA211 e TSI.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX1822",
    name: "Filtro de Ar Mahle LX1822",
    description: "Filtro de ar motor para GM Onix, Prisma, Cobalt 1.0/1.4 Flex.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Agile", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX2943",
    name: "Filtro de Ar Mahle LX2943",
    description: "Filtro de ar para GM Onix, Tracker nova geração 1.0 Turbo.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX2058",
    name: "Filtro de Ar Mahle LX2058",
    description: "Filtro de ar para Renault Kwid 1.0 SCe Flex.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX1560",
    name: "Filtro de Ar Mahle LX1560",
    description: "Filtro de ar para Renault Sandero, Logan e Duster 1.0/1.6 Flex.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX1804",
    name: "Filtro de Ar Mahle LX1804",
    description: "Filtro de ar para Hyundai HB20 e HB20S 1.0/1.6 Flex.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20X", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX1886",
    name: "Filtro de Ar Mahle LX1886",
    description: "Filtro de ar para Honda Fit, City, WR-V 1.5 Flex.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_ar", categoryName: "Filtros de Ar",
    oemNumber: "MAHLE-LX2094",
    name: "Filtro de Ar Mahle LX2094",
    description: "Filtro de ar para Ford Ka 1.0/1.5 e EcoSport 1.5 Flex.",
    brand: "Mahle", weightKg: 0.3,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 / 1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "EcoSport", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ── FILTROS DE CABINE (AR CONDICIONADO) ───────────────────────────────────
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA580",
    name: "Filtro de Cabine Mahle LA580",
    description: "Filtro de ar da cabine (ar condicionado) para Fiat Argo, Cronos, Mobi e Uno.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "Todos", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA556",
    name: "Filtro de Cabine Mahle LA556",
    description: "Filtro de ar da cabine para VW Gol G5/G6/G7, Voyage, Fox e Saveiro.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Fox", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
    ],
  },
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA842",
    name: "Filtro de Cabine Mahle LA842",
    description: "Filtro de ar da cabine para VW Polo, Virtus, T-Cross e Nivus.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "Todos", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "Todos", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA500",
    name: "Filtro de Cabine Mahle LA500",
    description: "Filtro de ar da cabine para GM Onix, Prisma e Cobalt.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA780",
    name: "Filtro de Cabine Mahle LA780",
    description: "Filtro de ar da cabine para GM Onix Turbo, Tracker e Montana nova geração.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "Todos", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "Todos", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "Todos", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA430",
    name: "Filtro de Cabine Mahle LA430",
    description: "Filtro de ar da cabine para Hyundai HB20, HB20S e HB20X.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20X", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_filtros_cabine", categoryName: "Filtros de Cabine",
    oemNumber: "MAHLE-LA480",
    name: "Filtro de Cabine Mahle LA480",
    description: "Filtro de ar da cabine para Renault Kwid, Sandero e Logan.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
];

const categorias = {
  cat_filtros_ar: { name: "Filtros de Ar", icon: "💨" },
  cat_filtros_cabine: { name: "Filtros de Cabine", icon: "❄️" },
};

async function seed() {
  console.log("🚀 Iniciando seed Mahle Filtros de Ar + Cabine...\n");
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
  console.log(`\n🎉 Seed concluído! ${masterCount} filtros | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
