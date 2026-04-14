/**
 * SEED NTN/SNR — Rolamentos e Cubos de Roda
 * Fonte: Catálogo NTN Brasil 2024 + referências cruzadas Zeno/Balcão Automotivo
 * Roda com: node scripts/seedNTN.js
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
const CATEGORY_ID = "cat_rolamentos";

const rolamentos = [

  // ── VW Gol G1-G4 Dianteiro ───────────────────────────────────────────────
  {
    oemNumber: "NTN-GB40588S01",
    name: "Rolamento de Roda Dianteiro NTN GB40588S01",
    description: "Rolamento de roda dianteiro para VW Gol G1 a G4, Parati, Saveiro e Voyage.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Gasolina", yearFrom: 1981, yearTo: 2008 },
      { brand: "Volkswagen", model: "Parati", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 2006 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 2008 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 1995 },
    ],
  },

  // ── VW Gol G5/G6/G7, Fox, Voyage Dianteiro ──────────────────────────────
  {
    oemNumber: "NTN-GB40692S01",
    name: "Rolamento de Roda Dianteiro NTN GB40692S01",
    description: "Rolamento de roda dianteiro para VW Gol G5, G6, G7, Fox, CrossFox e Voyage.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Fox", engine: "Todos", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
    ],
  },

  // ── VW Polo, Virtus, T-Cross Dianteiro (XGB46715T01) ─────────────────────
  {
    oemNumber: "NTN-XGB46715T01",
    name: "Rolamento de Roda Dianteiro NTN XGB46715T01",
    description: "Rolamento dianteiro para VW Polo 1.0/1.6 aspirado e Virtus 1.6 (a partir de 2017/2018).",
    brand: "NTN", position: "Dianteiro", weightKg: 0.6,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 / 1.6 aspirado", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.6 16v MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },

  // ── VW Polo TSI, T-Cross, Nivus Dianteiro (XGB46716T01) ──────────────────
  {
    oemNumber: "NTN-XGB46716T01",
    name: "Rolamento de Roda Dianteiro NTN XGB46716T01",
    description: "Rolamento dianteiro para VW Polo TSI, T-Cross, Nivus e Virtus 1.4 Turbo.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.6,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.4 TSI Turbo", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI / 1.4 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI / 1.4 TSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },

  // ── Fiat Palio, Siena, Uno, Argo Dianteiro ───────────────────────────────
  {
    oemNumber: "NTN-GB40527S02",
    name: "Rolamento de Roda Dianteiro NTN GB40527S02",
    description: "Rolamento dianteiro para Fiat Palio, Siena, Uno, Argo, Cronos e Mobi.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "Todos", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "Todos", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "Todos", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
    ],
  },

  // ── Fiat Bravo, Linea, Grand Siena Dianteiro ─────────────────────────────
  {
    oemNumber: "NTN-GB40692S03",
    name: "Rolamento de Roda Dianteiro NTN GB40692S03",
    description: "Rolamento dianteiro para Fiat Bravo, Linea e Grand Siena E.torQ.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Fiat", model: "Bravo", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Fiat", model: "Linea", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Fiat", model: "Grand Siena", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── GM Onix, Prisma, Cobalt, Classic Dianteiro ───────────────────────────
  {
    oemNumber: "NTN-GB40692S08",
    name: "Rolamento de Roda Dianteiro NTN GB40692S08",
    description: "Rolamento dianteiro para GM Onix, Prisma, Cobalt, Agile e Classic Flex.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Chevrolet", model: "Agile", engine: "Todos", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
    ],
  },

  // ── GM Celta, Corsa, Meriva Traseiro (SNR R153.07S) ───────────────────────
  {
    oemNumber: "SNR-R15307S",
    name: "Kit Rolamento Traseiro SNR R153.07S",
    description: "Kit rolamento traseiro para GM Celta, Corsa, Classic, Prisma e Agile.",
    brand: "SNR", position: "Traseiro", weightKg: 0.4,
    applications: [
      { brand: "Chevrolet", model: "Celta", engine: "Todos", fuel: "Flex", yearFrom: 2000, yearTo: 2016 },
      { brand: "Chevrolet", model: "Corsa", engine: "Todos", fuel: "Gasolina", yearFrom: 1994, yearTo: 2010 },
      { brand: "Chevrolet", model: "Classic", engine: "Todos", fuel: "Flex", yearFrom: 2002, yearTo: 2016 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2006, yearTo: 2012 },
      { brand: "Chevrolet", model: "Agile", engine: "Todos", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
      { brand: "Chevrolet", model: "Meriva", engine: "Todos", fuel: "Flex", yearFrom: 2003, yearTo: 2012 },
    ],
  },

  // ── GM Onix, Tracker nova geração Dianteiro ───────────────────────────────
  {
    oemNumber: "NTN-GB40500S18",
    name: "Rolamento de Roda Dianteiro NTN GB40500S18",
    description: "Rolamento dianteiro para GM Onix Turbo, Tracker e Montana nova geração.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.6,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },

  // ── Honda Fit, City Traseiro (SNR XHGB45011S01) ───────────────────────────
  {
    oemNumber: "SNR-XHGB45011S01",
    name: "Cubo de Roda Traseiro SNR XHGB45011S01",
    description: "Cubo de roda traseiro com rolamento e ABS para Honda City e Fit 2015 a 2021.",
    brand: "SNR", position: "Traseiro", weightKg: 0.8,
    applications: [
      { brand: "Honda", model: "City", engine: "Todos", fuel: "Flex", yearFrom: 2015, yearTo: 2021 },
      { brand: "Honda", model: "Fit", engine: "Todos", fuel: "Flex", yearFrom: 2015, yearTo: 2021 },
      { brand: "Honda", model: "WR-V", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ── Honda Fit, City Dianteiro ─────────────────────────────────────────────
  {
    oemNumber: "NTN-GB40527S05",
    name: "Rolamento de Roda Dianteiro NTN GB40527S05",
    description: "Rolamento dianteiro para Honda Fit e City 1.5 Flex.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
    ],
  },

  // ── Hyundai HB20, HB20S Dianteiro ────────────────────────────────────────
  {
    oemNumber: "NTN-GB40588S05",
    name: "Rolamento de Roda Dianteiro NTN GB40588S05",
    description: "Rolamento dianteiro para Hyundai HB20, HB20S e HB20X.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20X", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── Renault Sandero, Logan, Kwid Dianteiro ────────────────────────────────
  {
    oemNumber: "NTN-GB40527S07",
    name: "Rolamento de Roda Dianteiro NTN GB40527S07",
    description: "Rolamento dianteiro para Renault Kwid, Sandero, Logan e Duster.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "Todos", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "Todos", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },

  // ── Ford Ka, Fiesta Dianteiro ─────────────────────────────────────────────
  {
    oemNumber: "NTN-GB40527S09",
    name: "Rolamento de Roda Dianteiro NTN GB40527S09",
    description: "Rolamento dianteiro para Ford Ka, Ka+ e EcoSport.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Ford", model: "Ka", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "Todos", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "EcoSport", engine: "Todos", fuel: "Flex", yearFrom: 2003, yearTo: null },
    ],
  },

  // ── Toyota Etios, Yaris Dianteiro ─────────────────────────────────────────
  {
    oemNumber: "NTN-GB40588S10",
    name: "Rolamento de Roda Dianteiro NTN GB40588S10",
    description: "Rolamento dianteiro para Toyota Etios e Yaris Flex.",
    brand: "NTN", position: "Dianteiro", weightKg: 0.5,
    applications: [
      { brand: "Toyota", model: "Etios", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed NTN/SNR Rolamentos de Roda...\n");
  await db.collection("categories").doc(CATEGORY_ID).set({ name: "Rolamentos de Roda", icon: "⭕", active: true }, { merge: true });
  console.log("✅ Categoria: Rolamentos de Roda");
  let masterCount = 0, compatCount = 0;
  for (const item of rolamentos) {
    const { applications, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({ ...partData, categoryId: CATEGORY_ID, categoryName: "Rolamentos de Roda", active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    masterCount++;
    console.log(`  ✅ ${item.oemNumber}`);
    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({ masterPartId: masterRef.id, oemNumber: item.oemNumber, brand: app.brand, model: app.model, engine: app.engine, fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }
  console.log(`\n🎉 Seed concluído! ${masterCount} rolamentos | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
