/**
 * SEED TRW — Pastilhas de Freio Dianteiras e Traseiras
 * Fonte: Catálogo TRW/ZF Aftermarket Brasil + referências cruzadas
 * Cobre os carros mais vendidos do Brasil: VW, Fiat, GM, Ford, Renault, Honda, Hyundai, Toyota
 *
 * Roda com: node scripts/seedTRW.js
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config();


// ── Firebase Init ────────────────────────────────────────────────────────────
const keyPath = resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
const sa = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const CATEGORY_ID = "cat_pastilhas_freio";

// ── Dados TRW reais ──────────────────────────────────────────────────────────
const pastilhas = [

  // ── GDB1813 — Fiat Palio, Siena, Strada, Uno, Doblò Dianteira ────────────
  {
    oemNumber: "TRW-GDB1813",
    name: "Pastilha de Freio Dianteira TRW GDB1813",
    description: "Pastilha dianteira para motores Fire e Firefly Fiat. Uma das mais vendidas do Brasil.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 / 1.6 / 1.8", fuel: "Flex", yearFrom: 1998, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.3 / 1.4", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Doblò", engine: "1.3 / 1.4 / 1.8", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 / 1.4", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 / 1.8", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── GDB3327 — Fiat Bravo, Linea, Grand Siena, Toro Dianteira ─────────────
  {
    oemNumber: "TRW-GDB3327",
    name: "Pastilha de Freio Dianteira TRW GDB3327",
    description: "Pastilha dianteira para motores E.torQ 1.6 e 1.8 Fiat.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Fiat", model: "Bravo", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Fiat", model: "Linea", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Fiat", model: "Grand Siena", engine: "1.6 16v E.torQ", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Fiat", model: "Idea", engine: "1.6 / 1.8 E.torQ", fuel: "Flex", yearFrom: 2011, yearTo: 2016 },
      { brand: "Fiat", model: "Toro", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── GDB9038 — VW Gol G5/G6, Fox, Voyage, Crossfox Dianteira ─────────────
  {
    oemNumber: "TRW-GDB9038",
    name: "Pastilha de Freio Dianteira TRW GDB9038",
    description: "Pastilha dianteira para motores EA111 1.0 e 1.6 VW. Cobre toda a geração Gol G5 e G6.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "1.6 EA111", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Volkswagen", model: "SpaceFox", engine: "1.6 EA111", fuel: "Flex", yearFrom: 2006, yearTo: 2017 },
    ],
  },

  // ── GDB9081 — VW Polo, Virtus, Nivus, T-Cross, Golf Dianteira ────────────
  {
    oemNumber: "TRW-GDB9081",
    name: "Pastilha de Freio Dianteira TRW GDB9081",
    description: "Pastilha dianteira para plataforma MQB VW — Polo, Virtus, T-Cross, Nivus e Golf.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI / 1.6 MSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Golf", engine: "1.4 TSI EA211", fuel: "Flex", yearFrom: 2014, yearTo: null },
    ],
  },

  // ── GDB9038 — VW Up! Dianteira ────────────────────────────────────────────
  {
    oemNumber: "TRW-GDB1798",
    name: "Pastilha de Freio Dianteira TRW GDB1798",
    description: "Pastilha dianteira para VW Up! e Gol G6/G7 EA211.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Volkswagen", model: "Up!", engine: "1.0 12v / TSI", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Gol", engine: "1.6 MSI EA211", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Voyage", engine: "1.6 MSI EA211", fuel: "Flex", yearFrom: 2014, yearTo: null },
    ],
  },

  // ── GDB1413 — GM Onix, Prisma, Cobalt, Classic Dianteira ─────────────────
  {
    oemNumber: "TRW-GDB1413",
    name: "Pastilha de Freio Dianteira TRW GDB1413",
    description: "Pastilha dianteira para motores GM 1.0, 1.4 e 1.8 Flex. Cobre a linha Onix até 2019.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Chevrolet", model: "Agile", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── GDB2038 — GM Onix Plus, Tracker 1.0 Turbo Dianteira ──────────────────
  {
    oemNumber: "TRW-GDB2038",
    name: "Pastilha de Freio Dianteira TRW GDB2038",
    description: "Pastilha dianteira para GM nova geração 1.0 Turbo — Onix, Tracker e Montana.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Chevrolet", model: "Montana", engine: "1.2 Turbo", fuel: "Flex", yearFrom: 2023, yearTo: null },
    ],
  },

  // ── GDB9073 — Nissan Kicks, Versa Dianteira ───────────────────────────────
  {
    oemNumber: "TRW-GDB9073",
    name: "Pastilha de Freio Dianteira TRW GDB9073",
    description: "Pastilha dianteira para Nissan Kicks e Versa 1.6 Flex.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Nissan", model: "Kicks", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Nissan", model: "Versa", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Nissan", model: "March", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2011, yearTo: 2021 },
    ],
  },

  // ── GDB1560 — Ford Ka, Fiesta, EcoSport 1.0/1.5/1.6 Dianteira ───────────
  {
    oemNumber: "TRW-GDB1560",
    name: "Pastilha de Freio Dianteira TRW GDB1560",
    description: "Pastilha dianteira para motores Ford Sigma 1.0, Dragon 1.5 e Rocam 1.6 Flex.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 / 1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Fiesta", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
      { brand: "Ford", model: "EcoSport", engine: "1.5 / 1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: null },
    ],
  },

  // ── GDB1450 — Honda Fit, City, WR-V Dianteira ────────────────────────────
  {
    oemNumber: "TRW-GDB1450",
    name: "Pastilha de Freio Dianteira TRW GDB1450",
    description: "Pastilha dianteira para Honda 1.5 e 1.8 Flex — Fit, City, Civic e WR-V.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Honda", model: "Civic", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: 2016 },
      { brand: "Honda", model: "HR-V", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
    ],
  },

  // ── GDB1813T — Fiat Palio, Siena Traseira ────────────────────────────────
  {
    oemNumber: "TRW-GDB3282",
    name: "Pastilha de Freio Traseira TRW GDB3282",
    description: "Pastilha traseira para Fiat Palio Weekend, Siena e Strada com freio a disco traseiro.",
    brand: "TRW",
    position: "Traseira",
    weightKg: 0.35,
    applications: [
      { brand: "Fiat", model: "Palio Weekend", engine: "1.6 / 1.8", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Bravo", engine: "1.8 E.torQ", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Fiat", model: "Linea", engine: "1.8 E.torQ", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Fiat", model: "Toro", engine: "1.8 / 2.4", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── GDB1264 — Renault Sandero, Logan, Kwid, Duster Dianteira ─────────────
  {
    oemNumber: "TRW-GDB1264",
    name: "Pastilha de Freio Dianteira TRW GDB1264",
    description: "Pastilha dianteira para motores Renault 1.0 SCe e 1.6 16v Flex.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Renault", model: "Oroch", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
    ],
  },

  // ── GDB3425 — Hyundai HB20, HB20S, Creta Dianteira ───────────────────────
  {
    oemNumber: "TRW-GDB3425",
    name: "Pastilha de Freio Dianteira TRW GDB3425",
    description: "Pastilha dianteira para Hyundai HB20, HB20S e Creta.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "Creta", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Kia", model: "Picanto", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── GDB3531 — Toyota Corolla, Yaris, Etios Dianteira ──────────────────────
  {
    oemNumber: "TRW-GDB3531",
    name: "Pastilha de Freio Dianteira TRW GDB3531",
    description: "Pastilha dianteira para Toyota Corolla, Yaris e Etios Flex.",
    brand: "TRW",
    position: "Dianteira",
    weightKg: 0.4,
    applications: [
      { brand: "Toyota", model: "Corolla", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Toyota", model: "Etios", engine: "1.3 / 1.5 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "RAV4", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2013, yearTo: null },
    ],
  },

  // ── GDB1375 — GM Cruze, Tracker 1.4T/1.8 Traseira ────────────────────────
  {
    oemNumber: "TRW-GDB1375",
    name: "Pastilha de Freio Traseira TRW GDB1375",
    description: "Pastilha traseira para Chevrolet Cruze e Tracker 1.4 Turbo e 1.8 Flex.",
    brand: "TRW",
    position: "Traseira",
    weightKg: 0.35,
    applications: [
      { brand: "Chevrolet", model: "Cruze", engine: "1.4 Turbo / 1.8 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo / 1.8 Flex", fuel: "Flex", yearFrom: 2013, yearTo: null },
      { brand: "Chevrolet", model: "Cruze Sport6", engine: "1.4 Turbo / 1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
];

// ── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  console.log("🚀 Iniciando seed TRW Pastilhas de Freio...\n");

  await db.collection("categories").doc(CATEGORY_ID).set({
    name: "Pastilhas de Freio",
    icon: "🛑",
    active: true,
  }, { merge: true });
  console.log("✅ Categoria: Pastilhas de Freio");

  let masterCount = 0;
  let compatCount = 0;

  for (const pastilha of pastilhas) {
    const { applications, ...partData } = pastilha;

    const masterRef = db.collection("masterParts").doc(
      pastilha.oemNumber.replace(/[^a-zA-Z0-9]/g, "_")
    );
    await masterRef.set({
      ...partData,
      categoryId: CATEGORY_ID,
      categoryName: "Pastilhas de Freio",
      active: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    masterCount++;
    console.log(`  ✅ masterPart: ${pastilha.oemNumber} — ${pastilha.name}`);

    for (const app of applications) {
      const compatId = `${pastilha.oemNumber}_${app.brand}_${app.model}_${app.engine}`
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();

      await db.collection("compatibilities").doc(compatId).set({
        masterPartId: masterRef.id,
        oemNumber: pastilha.oemNumber,
        brand: app.brand,
        model: app.model,
        engine: app.engine,
        fuel: app.fuel,
        yearFrom: app.yearFrom,
        yearTo: app.yearTo,
        active: true,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações cadastradas`);
  }

  console.log(`\n🎉 Seed concluído!`);
  console.log(`   ${masterCount} pastilhas no masterParts`);
  console.log(`   ${compatCount} compatibilidades cadastradas`);
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});