/**
 * SEED FRAS-LE — Sapatas de Freio (Tambor) + Tambores
 * Fonte: Catálogo Fras-le Brasil + Authomix + MGFreios
 * Roda com: node scripts/seedFrasle.js
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const CATEGORY_ID = "cat_sapatas_freio";

const sapatas = [
  // ── VW Gol G1-G4 Traseiro (180x30mm) ─────────────────────────────────────
  {
    oemNumber: "FRASLE-SA16820",
    name: "Sapata de Freio Fras-le SA16820",
    description: "Sapata de freio traseiro 177x31mm sistema Varga para VW Gol G1 a G4, Parati, Saveiro e Voyage.",
    brand: "Fras-le", dimension: "177x31mm", system: "Varga", weightKg: 0.8,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Gasolina", yearFrom: 1981, yearTo: 2008 },
      { brand: "Volkswagen", model: "Parati", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 2006 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 2008 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 1995 },
    ],
  },
  // ── VW Gol G5/G6, Fox, Voyage Traseiro (200x40mm) ─────────────────────────
  {
    oemNumber: "FRASLE-SA16830",
    name: "Sapata de Freio Fras-le SA16830",
    description: "Sapata de freio traseiro 200x40mm sistema Teves para VW Gol G5/G6, Fox, Voyage e Saveiro.",
    brand: "Fras-le", dimension: "200x40mm", system: "Teves", weightKg: 0.9,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Fox", engine: "Todos", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "SpaceFox", engine: "Todos", fuel: "Flex", yearFrom: 2006, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2016 },
    ],
  },
  // ── Fiat Palio, Siena, Uno Traseiro (180x30mm) ────────────────────────────
  {
    oemNumber: "FRASLE-SA20150",
    name: "Sapata de Freio Fras-le SA20150",
    description: "Sapata de freio traseiro 180x30mm sistema Bendix/Teves para Fiat Palio, Siena, Uno e Strada.",
    brand: "Fras-le", dimension: "180x30mm", system: "Bendix/Teves", weightKg: 0.8,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 / 1.5 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  // ── Fiat Uno Vivace, Novo Uno Traseiro (203x38mm) ─────────────────────────
  {
    oemNumber: "FRASLE-SA20163",
    name: "Sapata de Freio Fras-le SA20163",
    description: "Sapata de freio traseiro 203x38mm para Fiat Novo Uno e Grand Siena com ABS.",
    brand: "Fras-le", dimension: "203x38mm", system: "Teves", weightKg: 0.9,
    applications: [
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Firefly", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  // ── GM Onix, Prisma Traseiro (200x37mm) ───────────────────────────────────
  {
    oemNumber: "FRASLE-SA34020",
    name: "Sapata de Freio Fras-le SA34020",
    description: "Sapata de freio traseiro 200x37mm sistema Lucas para GM Onix, Prisma e Cobalt.",
    brand: "Fras-le", dimension: "200x37mm", system: "Lucas", weightKg: 0.9,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
  // ── GM Corsa, Classic, Celta Traseiro (180x32mm) ──────────────────────────
  {
    oemNumber: "FRASLE-SA34005",
    name: "Sapata de Freio Fras-le SA34005",
    description: "Sapata de freio traseiro 180x32mm sistema Varga para GM Corsa, Classic e Celta.",
    brand: "Fras-le", dimension: "180x32mm", system: "Varga", weightKg: 0.8,
    applications: [
      { brand: "Chevrolet", model: "Celta", engine: "Todos", fuel: "Flex", yearFrom: 2000, yearTo: 2016 },
      { brand: "Chevrolet", model: "Corsa", engine: "Todos", fuel: "Gasolina", yearFrom: 1994, yearTo: 2010 },
      { brand: "Chevrolet", model: "Classic", engine: "Todos", fuel: "Flex", yearFrom: 2002, yearTo: 2016 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2006, yearTo: 2012 },
    ],
  },
  // ── GM Agile, Corsa Hatch Traseiro (200x29mm) ─────────────────────────────
  {
    oemNumber: "FRASLE-SA34015",
    name: "Sapata de Freio Fras-le SA34015",
    description: "Sapata de freio traseiro 200x29mm sistema Varga para GM Agile e Corsa Hatch.",
    brand: "Fras-le", dimension: "200x29mm", system: "Varga", weightKg: 0.8,
    applications: [
      { brand: "Chevrolet", model: "Agile", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
      { brand: "Chevrolet", model: "Corsa", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2002, yearTo: 2012 },
    ],
  },
  // ── Ford Ka, Fiesta, EcoSport Traseiro (180x32mm) ─────────────────────────
  {
    oemNumber: "FRASLE-SA50010",
    name: "Sapata de Freio Fras-le SA50010",
    description: "Sapata de freio traseiro 180x32mm sistema Varga para Ford Ka, Fiesta e EcoSport.",
    brand: "Fras-le", dimension: "180x32mm", system: "Varga", weightKg: 0.8,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 / 1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 1997, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Fiesta", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 1997, yearTo: 2013 },
      { brand: "Ford", model: "EcoSport", engine: "1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: null },
    ],
  },
  // ── Renault Sandero, Logan, Kwid Traseiro (203x42mm) ─────────────────────
  {
    oemNumber: "FRASLE-SA70010",
    name: "Sapata de Freio Fras-le SA70010",
    description: "Sapata de freio traseiro 203x42mm para Renault Kwid, Sandero, Logan e Clio.",
    brand: "Fras-le", dimension: "203x42mm", system: "Lucas", weightKg: 0.9,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "Todos", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "Todos", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Clio", engine: "Todos", fuel: "Flex", yearFrom: 2000, yearTo: 2012 },
    ],
  },
  // ── Hyundai HB20, HB20S Traseiro ─────────────────────────────────────────
  {
    oemNumber: "FRASLE-SA60010",
    name: "Sapata de Freio Fras-le SA60010",
    description: "Sapata de freio traseiro para Hyundai HB20 e HB20S.",
    brand: "Fras-le", dimension: "180x35mm", system: "Mando", weightKg: 0.8,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed Fras-le Sapatas de Freio...\n");
  await db.collection("categories").doc(CATEGORY_ID).set({ name: "Sapatas de Freio", icon: "🛑", active: true }, { merge: true });
  console.log("✅ Categoria: Sapatas de Freio");
  let masterCount = 0, compatCount = 0;
  for (const item of sapatas) {
    const { applications, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({ ...partData, categoryId: CATEGORY_ID, categoryName: "Sapatas de Freio", active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    masterCount++;
    console.log(`  ✅ ${item.oemNumber}`);
    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({ masterPartId: masterRef.id, oemNumber: item.oemNumber, brand: app.brand, model: app.model, engine: app.engine, fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }
  console.log(`\n🎉 Seed concluído! ${masterCount} sapatas | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
