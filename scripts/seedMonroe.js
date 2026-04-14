/**
 * SEED MONROE — Amortecedores Dianteiros e Traseiros
 * Fonte: Catálogo Monroe Brasil + referências cruzadas DiskPeças/DudaParts
 * Cobre os carros mais vendidos do Brasil
 *
 * Roda com: node scripts/seedMonroe.js
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

const CATEGORY_ID = "cat_amortecedores";

const amortecedores = [

  // ── MONROE 334083MM — VW Gol G1/G2/G3/G4 Dianteiro ──────────────────────
  {
    oemNumber: "MONROE-334083MM",
    name: "Amortecedor Dianteiro Monroe 334083MM",
    description: "Amortecedor dianteiro cartucho hidráulico para VW Gol G1 a G4, Parati, Saveiro e Voyage.",
    brand: "Monroe", position: "Dianteiro", weightKg: 1.8,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 / 1.8", fuel: "Gasolina", yearFrom: 1981, yearTo: 2008 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 / 1.6 / 1.8", fuel: "Gasolina", yearFrom: 1982, yearTo: 2006 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6", fuel: "Gasolina", yearFrom: 1982, yearTo: 2008 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6", fuel: "Gasolina", yearFrom: 1982, yearTo: 1995 },
    ],
  },

  // ── MONROE SP320 — VW Gol G5/G6/G7, Voyage Dianteiro ────────────────────
  {
    oemNumber: "MONROE-SP320",
    name: "Amortecedor Dianteiro Monroe SP320 OESpectrum",
    description: "Amortecedor dianteiro pressurizado para VW Gol G5, G6, G7 e Voyage. Linha OESpectrum.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
    ],
  },

  // ── MONROE SP322 — VW Gol G5/G6/G7, Voyage Traseiro ─────────────────────
  {
    oemNumber: "MONROE-SP322",
    name: "Amortecedor Traseiro Monroe SP322 OESpectrum",
    description: "Amortecedor traseiro pressurizado para VW Gol G5, G6, G7 e Voyage.",
    brand: "Monroe", position: "Traseiro", weightKg: 1.8,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
    ],
  },

  // ── MONROE 334048MM — VW Gol G2-G8, Parati Traseiro ──────────────────────
  {
    oemNumber: "MONROE-334048MM",
    name: "Amortecedor Traseiro Monroe 334048MM",
    description: "Amortecedor traseiro estrutural para VW Gol G2 ao G8 e Parati.",
    brand: "Monroe", position: "Traseiro", weightKg: 1.5,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1994, yearTo: 2022 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: 2012 },
    ],
  },

  // ── MONROE SP324 — VW Fox, CrossFox, SpaceFox Dianteiro ──────────────────
  {
    oemNumber: "MONROE-SP324",
    name: "Amortecedor Dianteiro Monroe SP324",
    description: "Amortecedor dianteiro para VW Fox, CrossFox e SpaceFox.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "1.6", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "SpaceFox", engine: "1.6", fuel: "Flex", yearFrom: 2006, yearTo: 2017 },
    ],
  },

  // ── MONROE SP350 — VW Polo, Virtus, T-Cross Dianteiro ────────────────────
  {
    oemNumber: "MONROE-SP350",
    name: "Amortecedor Dianteiro Monroe SP350",
    description: "Amortecedor dianteiro para plataforma MQB VW — Polo, Virtus, T-Cross e Nivus.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.2,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },

  // ── MONROE G8021 — Fiat Palio, Siena, Uno, Strada Dianteiro ──────────────
  {
    oemNumber: "MONROE-G8021",
    name: "Amortecedor Dianteiro Monroe G8021",
    description: "Amortecedor dianteiro para Fiat Palio, Siena, Uno, Strada e Fiorino Fire/Firefly.",
    brand: "Monroe", position: "Dianteiro", weightKg: 1.9,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.3 / 1.4", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1998, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 / 1.4", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },

  // ── MONROE G8043 — Fiat Argo, Cronos, Mobi Dianteiro ────────────────────
  {
    oemNumber: "MONROE-G8043",
    name: "Amortecedor Dianteiro Monroe G8043",
    description: "Amortecedor dianteiro para Fiat Argo, Cronos e Mobi Firefly.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 / 1.8 Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── MONROE G8029 — Fiat Palio, Siena, Uno Traseiro ───────────────────────
  {
    oemNumber: "MONROE-G8029",
    name: "Amortecedor Traseiro Monroe G8029",
    description: "Amortecedor traseiro para Fiat Palio, Siena, Uno e Grand Siena.",
    brand: "Monroe", position: "Traseiro", weightKg: 1.5,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "1.0 / 1.4 / 1.6", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── MONROE G8070 — GM Onix, Prisma, Cobalt Dianteiro ────────────────────
  {
    oemNumber: "MONROE-G8070",
    name: "Amortecedor Dianteiro Monroe G8070",
    description: "Amortecedor dianteiro para GM Onix, Prisma, Cobalt e Spin.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── MONROE G8090 — GM Onix Plus, Tracker 1.0T Dianteiro ─────────────────
  {
    oemNumber: "MONROE-G8090",
    name: "Amortecedor Dianteiro Monroe G8090",
    description: "Amortecedor dianteiro para GM nova geração — Onix Turbo, Tracker e Montana.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.1,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Chevrolet", model: "Montana", engine: "1.2 Turbo", fuel: "Flex", yearFrom: 2023, yearTo: null },
    ],
  },

  // ── MONROE G8075 — GM Onix, Prisma Traseiro ──────────────────────────────
  {
    oemNumber: "MONROE-G8075",
    name: "Amortecedor Traseiro Monroe G8075",
    description: "Amortecedor traseiro para GM Onix e Prisma até 2019.",
    brand: "Monroe", position: "Traseiro", weightKg: 1.6,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
    ],
  },

  // ── MONROE HB20-D — Hyundai HB20, HB20S Dianteiro ───────────────────────
  {
    oemNumber: "MONROE-G8110",
    name: "Amortecedor Dianteiro Monroe G8110",
    description: "Amortecedor dianteiro para Hyundai HB20 e HB20S.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20X", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── MONROE R6038 — Renault Kwid Dianteiro ────────────────────────────────
  {
    oemNumber: "MONROE-R6038",
    name: "Amortecedor Dianteiro Monroe R6038",
    description: "Amortecedor dianteiro para Renault Kwid 1.0 SCe Flex.",
    brand: "Monroe", position: "Dianteiro", weightKg: 1.8,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ── MONROE R6020 — Renault Sandero, Logan, Duster Dianteiro ──────────────
  {
    oemNumber: "MONROE-R6020",
    name: "Amortecedor Dianteiro Monroe R6020",
    description: "Amortecedor dianteiro para Renault Sandero, Logan e Duster.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Renault", model: "Oroch", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
    ],
  },

  // ── MONROE H4054 — Honda Fit, City Dianteiro ─────────────────────────────
  {
    oemNumber: "MONROE-H4054",
    name: "Amortecedor Dianteiro Monroe H4054",
    description: "Amortecedor dianteiro para Honda Fit, City e WR-V.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ── MONROE F4040 — Ford Ka, Fiesta Dianteiro ─────────────────────────────
  {
    oemNumber: "MONROE-F4040",
    name: "Amortecedor Dianteiro Monroe F4040",
    description: "Amortecedor dianteiro para Ford Ka e Fiesta.",
    brand: "Monroe", position: "Dianteiro", weightKg: 1.9,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 / 1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Fiesta", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
    ],
  },

  // ── MONROE T4060 — Toyota Etios, Yaris Dianteiro ─────────────────────────
  {
    oemNumber: "MONROE-T4060",
    name: "Amortecedor Dianteiro Monroe T4060",
    description: "Amortecedor dianteiro para Toyota Etios e Yaris Flex.",
    brand: "Monroe", position: "Dianteiro", weightKg: 2.0,
    applications: [
      { brand: "Toyota", model: "Etios", engine: "1.3 / 1.5 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed Monroe Amortecedores...\n");

  await db.collection("categories").doc(CATEGORY_ID).set({
    name: "Amortecedores",
    icon: "🔩",
    active: true,
  }, { merge: true });
  console.log("✅ Categoria: Amortecedores");

  let masterCount = 0;
  let compatCount = 0;

  for (const item of amortecedores) {
    const { applications, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(
      item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_")
    );
    await masterRef.set({
      ...partData,
      categoryId: CATEGORY_ID,
      categoryName: "Amortecedores",
      active: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    masterCount++;
    console.log(`  ✅ masterPart: ${item.oemNumber}`);

    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`
        .replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({
        masterPartId: masterRef.id,
        oemNumber: item.oemNumber,
        brand: app.brand, model: app.model, engine: app.engine,
        fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo,
        active: true,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }

  console.log(`\n🎉 Seed concluído! ${masterCount} amortecedores | ${compatCount} compatibilidades`);
  process.exit(0);
}

seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
