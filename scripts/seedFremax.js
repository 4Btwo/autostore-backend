/**
 * SEED FREMAX — Discos de Freio Dianteiros e Traseiros
 * Fonte: Catálogo Fremax Brasil + referências cruzadas Berko/Zezinho/Krambeck
 * Roda com: node scripts/seedFremax.js
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
const CATEGORY_ID = "cat_discos_freio";

const discos = [

  // ── BD0178 — Fiat Palio, Siena, Strada Dianteiro 240mm ───────────────────
  {
    oemNumber: "FREMAX-BD0178",
    name: "Disco de Freio Dianteiro Fremax BD0178",
    description: "Disco de freio dianteiro ventilado 240mm para Fiat Palio, Siena, Strada e Uno Fire/Firefly.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.1,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.3 / 1.4 / 1.5 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1998, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.3 / 1.4", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 / 1.4", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },

  // ── BD5017 — Fiat Argo, Cronos, Mobi Dianteiro ───────────────────────────
  {
    oemNumber: "FREMAX-BD5017",
    name: "Disco de Freio Dianteiro Fremax BD5017",
    description: "Disco de freio dianteiro ventilado para Fiat Argo, Cronos e Mobi Firefly.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.0,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 / 1.8 Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── BD5297 — VW Gol G5/G6, Saveiro, Voyage Dianteiro 256mm ───────────────
  {
    oemNumber: "FREMAX-BD5297",
    name: "Disco de Freio Dianteiro Fremax BD5297",
    description: "Disco de freio dianteiro ventilado 256mm para VW Gol G5/G6, Saveiro e Voyage EA111.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.1,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2013 },
    ],
  },

  // ── BD5648 — VW Polo, Virtus, T-Cross, Nivus Dianteiro ───────────────────
  {
    oemNumber: "FREMAX-BD5648",
    name: "Disco de Freio Dianteiro Fremax BD5648",
    description: "Disco de freio dianteiro ventilado para VW Polo, Virtus, T-Cross e Nivus TSI.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.3,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI / 1.4 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },

  // ── BD5649 — VW Polo, Virtus, T-Cross, Nivus Traseiro ────────────────────
  {
    oemNumber: "FREMAX-BD5649",
    name: "Disco de Freio Traseiro Fremax BD5649",
    description: "Disco de freio traseiro sólido para VW Polo, Virtus, T-Cross e Nivus TSI.",
    brand: "Fremax", position: "Traseiro", weightKg: 3.0,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI / 1.4 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },

  // ── BD4700 — GM Onix, Prisma, Cobalt Dianteiro ───────────────────────────
  {
    oemNumber: "FREMAX-BD4700",
    name: "Disco de Freio Dianteiro Fremax BD4700",
    description: "Disco de freio dianteiro ventilado para GM Onix, Prisma, Cobalt e Spin Flex.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.0,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── BD5184 — GM Onix Turbo, Tracker Dianteiro ────────────────────────────
  {
    oemNumber: "FREMAX-BD5184",
    name: "Disco de Freio Dianteiro Fremax BD5184",
    description: "Disco de freio dianteiro ventilado para GM Onix Turbo, Tracker e Montana nova geração.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.3,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },

  // ── BD3108 — Ford Ka, Fiesta Dianteiro ───────────────────────────────────
  {
    oemNumber: "FREMAX-BD3108",
    name: "Disco de Freio Dianteiro Fremax BD3108",
    description: "Disco de freio dianteiro ventilado para Ford Ka, Ka+ e Fiesta Flex.",
    brand: "Fremax", position: "Dianteiro", weightKg: 3.8,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 / 1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Fiesta", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
      { brand: "Ford", model: "EcoSport", engine: "1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: null },
    ],
  },

  // ── BD4393 — Honda Fit, City, WR-V Dianteiro ─────────────────────────────
  {
    oemNumber: "FREMAX-BD4393",
    name: "Disco de Freio Dianteiro Fremax BD4393",
    description: "Disco de freio dianteiro ventilado para Honda Fit, City, WR-V e Civic 1.8 Flex.",
    brand: "Fremax", position: "Dianteiro", weightKg: 4.0,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Honda", model: "Civic", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: 2016 },
    ],
  },

  // ── BD6004 — Hyundai HB20, HB20S Dianteiro ───────────────────────────────
  {
    oemNumber: "FREMAX-BD6004",
    name: "Disco de Freio Dianteiro Fremax BD6004",
    description: "Disco de freio dianteiro ventilado para Hyundai HB20, HB20S e HB20X Flex.",
    brand: "Fremax", position: "Dianteiro", weightKg: 3.9,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20X", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── BD6765 — Renault Kwid, Sandero, Logan Dianteiro ──────────────────────
  {
    oemNumber: "FREMAX-BD6765",
    name: "Disco de Freio Dianteiro Fremax BD6765",
    description: "Disco de freio dianteiro ventilado para Renault Kwid, Sandero, Logan e Duster Flex.",
    brand: "Fremax", position: "Dianteiro", weightKg: 3.8,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },

  // ── BD5403 — Toyota Etios, Yaris Dianteiro ───────────────────────────────
  {
    oemNumber: "FREMAX-BD5403",
    name: "Disco de Freio Dianteiro Fremax BD5403",
    description: "Disco de freio dianteiro ventilado para Toyota Etios e Yaris Flex.",
    brand: "Fremax", position: "Dianteiro", weightKg: 3.9,
    applications: [
      { brand: "Toyota", model: "Etios", engine: "1.3 / 1.5 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },

  // ── BD5403T — Toyota Etios, Yaris Traseiro ───────────────────────────────
  {
    oemNumber: "FREMAX-BD5403T",
    name: "Disco de Freio Traseiro Fremax BD5403T",
    description: "Disco de freio traseiro sólido para Toyota Corolla e Yaris Flex.",
    brand: "Fremax", position: "Traseiro", weightKg: 3.2,
    applications: [
      { brand: "Toyota", model: "Corolla", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed Fremax Discos de Freio...\n");
  await db.collection("categories").doc(CATEGORY_ID).set({ name: "Discos de Freio", icon: "🔴", active: true }, { merge: true });
  console.log("✅ Categoria: Discos de Freio");
  let masterCount = 0, compatCount = 0;
  for (const item of discos) {
    const { applications, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({ ...partData, categoryId: CATEGORY_ID, categoryName: "Discos de Freio", active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    masterCount++;
    console.log(`  ✅ ${item.oemNumber}`);
    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({ masterPartId: masterRef.id, oemNumber: item.oemNumber, brand: app.brand, model: app.model, engine: app.engine, fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }
  console.log(`\n🎉 Seed concluído! ${masterCount} discos | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
