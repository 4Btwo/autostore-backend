/**
 * SEED NGK — Velas de Ignição
 * Fonte: Catálogo Oficial NGK Brasil (CatalogoNGKNTK_4R_01042024)
 * Cobre os carros mais vendidos do Brasil: VW, Fiat, GM, Ford, Renault, Honda
 *
 * Roda com: node scripts/seedNGK.js
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Firebase Init ────────────────────────────────────────────────────────────
const sa = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8")
);
initializeApp({ credential: cert(sa) });
const db = getFirestore();

// ── Categoria ────────────────────────────────────────────────────────────────
const CATEGORY_ID = "cat_velas_ignicao";

// ── Dados NGK reais ──────────────────────────────────────────────────────────
// Formato: { oemNumber, name, description, applications[] }
// applications: { brand, model, engine, fuel, yearFrom, yearTo }
// Combustível: G=Gasolina, B=Flex, E=Etanol, T=Flex+GNV

const velas = [

  // ── NGK U5443 ─────────────────────────────────────────────────────────────
  {
    oemNumber: "NGK-U5443",
    name: "Vela de Ignição NGK U5443",
    description: "Vela iridium para motores Firefly 1.0 e 1.3 Fiat. Alta durabilidade e eficiência energética.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: 2015 },
    ],
  },

  // ── NGK U2079 ─────────────────────────────────────────────────────────────
  {
    oemNumber: "NGK-U2079",
    name: "Vela de Ignição NGK U2079",
    description: "Vela para motores Fire 1.0 e 1.4 Fiat. Compatível com sistemas de injeção MPI.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2006, yearTo: 2009 },
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire Economy", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Idea", engine: "1.4 8v ELX Flex", fuel: "Flex", yearFrom: 2006, yearTo: null },
      { brand: "Fiat", model: "Doblò", engine: "1.3 16v Fire", fuel: "Gasolina", yearFrom: 2002, yearTo: 2006 },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 8v MPI Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: 2012 },
    ],
  },

  // ── NGK U2113 ─────────────────────────────────────────────────────────────
  {
    oemNumber: "NGK-U2113",
    name: "Vela de Ignição NGK U2113",
    description: "Vela para motores Fire EVO e E.torQ Fiat. Sem suporte lateral.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire EVO", fuel: "Flex", yearFrom: 2012, yearTo: 2016 },
      { brand: "Fiat", model: "Grand Siena", engine: "1.0 8v Fire EVO", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "1.0 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: null },
      { brand: "Fiat", model: "Bravo", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2013, yearTo: 2016 },
      { brand: "Fiat", model: "Linea", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2013, yearTo: 2016 },
    ],
  },

  // ── NGK U6061 ─────────────────────────────────────────────────────────────
  {
    oemNumber: "NGK-U6061",
    name: "Vela de Ignição NGK U6061",
    description: "Vela para motores Fire EVO 1.4 Fiat. Alta performance e economia.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Fiat", model: "500", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2011, yearTo: 2017 },
      { brand: "Fiat", model: "Grand Siena", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Fiat", model: "Palio", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: null },
    ],
  },

  // ── NGK U6004 ─────────────────────────────────────────────────────────────
  {
    oemNumber: "NGK-U6004",
    name: "Vela de Ignição NGK U6004",
    description: "Vela para motores TU5JP4 1.6 16v Citroën/Peugeot. Gasolina e Flex.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Citroën", model: "C3", engine: "1.6 16v", fuel: "Flex", yearFrom: 2006, yearTo: null },
      { brand: "Citroën", model: "C4", engine: "1.6 16v", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Citroën", model: "Aircross", engine: "1.6 16v", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Citroën", model: "Xsara Picasso", engine: "1.6 16v", fuel: "Flex", yearFrom: 2005, yearTo: null },
      { brand: "Peugeot", model: "206", engine: "1.6 16v", fuel: "Flex", yearFrom: 2006, yearTo: null },
      { brand: "Peugeot", model: "207", engine: "1.6 16v", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Peugeot", model: "208", engine: "1.6 16v", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── NGK BKR5E (Gol, Parati, Saveiro AP) ──────────────────────────────────
  {
    oemNumber: "NGK-BKR5E",
    name: "Vela de Ignição NGK BKR5E",
    description: "Vela para motores AP 1.6 e 1.8 VW. Clássico dos carros populares brasileiros.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.6 AP Carburado", fuel: "Gasolina", yearFrom: 1984, yearTo: 1996 },
      { brand: "Volkswagen", model: "Gol", engine: "1.8 AP Carburado", fuel: "Gasolina", yearFrom: 1984, yearTo: 1996 },
      { brand: "Volkswagen", model: "Parati", engine: "1.6 AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 1996 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.6 AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 1996 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.6 AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 1995 },
      { brand: "Volkswagen", model: "Santana", engine: "1.8 AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 1996 },
    ],
  },

  // ── NGK BKUR6ET (Gol G4/G5 1.0) ─────────────────────────────────────────
  {
    oemNumber: "NGK-BKUR6ET",
    name: "Vela de Ignição NGK BKUR6ET",
    description: "Vela iridium para motores 1.0 Total Flex VW. Maior durabilidade e economia de combustível.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 8v Total Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2012 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 8v Total Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2006 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 8v Total Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2009 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 8v Total Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2009 },
    ],
  },

  // ── NGK ILZKR7B (Golf, Polo, Virtus 1.0 TSI) ──────────────────────────────
  {
    oemNumber: "NGK-ILZKR7B",
    name: "Vela de Ignição NGK ILZKR7B",
    description: "Vela laser iridium para motores TSI 1.0 e 1.4 VW. Tecnologia de ponta para motores turbo.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Golf", engine: "1.4 TSI", fuel: "Flex", yearFrom: 2013, yearTo: null },
      { brand: "Volkswagen", model: "Jetta", engine: "1.4 TSI", fuel: "Flex", yearFrom: 2015, yearTo: null },
    ],
  },

  // ── NGK ILFR6B (Onix, Prisma 1.0/1.4) ────────────────────────────────────
  {
    oemNumber: "NGK-ILFR6B",
    name: "Vela de Ignição NGK ILFR6B",
    description: "Vela iridium para motores 1.0 e 1.4 Flex GM. Intervalo de troca de 60.000 km.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Onix", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
    ],
  },

  // ── NGK DILKAR7A11 (Onix Plus, Tracker 1.0 Turbo) ────────────────────────
  {
    oemNumber: "NGK-DILKAR7A11",
    name: "Vela de Ignição NGK DILKAR7A11",
    description: "Vela dupla iridium para motores 1.0 Turbo GM. Tecnologia premium para motores modernos.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Chevrolet", model: "Montana", engine: "1.2 Turbo", fuel: "Flex", yearFrom: 2023, yearTo: null },
    ],
  },

  // ── NGK BKR6EK (HB20, HB20S 1.0/1.6) ─────────────────────────────────────
  {
    oemNumber: "NGK-BKR6EK",
    name: "Vela de Ignição NGK BKR6EK",
    description: "Vela para motores Kappa 1.0 e Gamma 1.6 Hyundai/Kia.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20S", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Kia", model: "Picanto", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── NGK ILZKR7B-S (Kwid, Sandero 1.0) ────────────────────────────────────
  {
    oemNumber: "NGK-IFR6T10G",
    name: "Vela de Ignição NGK IFR6T10G",
    description: "Vela iridium para motores SCe 1.0 Renault.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 16v", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 16v", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Clio", engine: "1.0 16v", fuel: "Flex", yearFrom: 2006, yearTo: 2012 },
    ],
  },

  // ── NGK IZFR6K11 (Fit, City, Civic 1.5) ──────────────────────────────────
  {
    oemNumber: "NGK-IZFR6K11",
    name: "Vela de Ignição NGK IZFR6K11",
    description: "Vela laser iridium para motores Honda 1.5 e 1.8. Alta performance e durabilidade.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "Civic", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: 2016 },
      { brand: "Honda", model: "HR-V", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ── NGK BKR5EIX (Ford EcoSport, Ka, Fiesta 1.0/1.6) ──────────────────────
  {
    oemNumber: "NGK-BKR5EIX",
    name: "Vela de Ignição NGK BKR5EIX",
    description: "Vela iridium IX para motores Sigma 1.0 e Rocam 1.6 Ford. Desempenho superior.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2014 },
      { brand: "Ford", model: "Ka", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2014 },
      { brand: "Ford", model: "Fiesta", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
      { brand: "Ford", model: "Fiesta", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
      { brand: "Ford", model: "EcoSport", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2012 },
    ],
  },

  // ── NGK SILZKFR8C8S (Ford Ka 2015+ 1.5) ──────────────────────────────────
  {
    oemNumber: "NGK-SILZKFR8C8S",
    name: "Vela de Ignição NGK SILZKFR8C8S",
    description: "Vela dupla iridium para motores Dragon 1.5 Ford. Tecnologia avançada de ignição.",
    brand: "NGK",
    weightKg: 0.1,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "EcoSport", engine: "1.5 Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },
];

// ── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  console.log("🚀 Iniciando seed NGK Brasil...\n");

  // 1. Garante categoria
  await db.collection("categories").doc(CATEGORY_ID).set({
    name: "Velas de Ignição",
    icon: "⚡",
    active: true,
  }, { merge: true });
  console.log("✅ Categoria: Velas de Ignição");

  let masterCount = 0;
  let compatCount = 0;

  for (const vela of velas) {
    const { applications, ...partData } = vela;

    // 2. Cria/atualiza masterPart
    const masterRef = db.collection("masterParts").doc(vela.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({
      ...partData,
      categoryId: CATEGORY_ID,
      categoryName: "Velas de Ignição",
      active: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    masterCount++;
    console.log(`  ✅ masterPart: ${vela.oemNumber} — ${vela.name}`);

    // 3. Cria compatibilidades
    for (const app of applications) {
      const compatId = `${vela.oemNumber}_${app.brand}_${app.model}_${app.engine}`
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();

      await db.collection("compatibilities").doc(compatId).set({
        masterPartId: masterRef.id,
        oemNumber: vela.oemNumber,
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
  console.log(`   ${masterCount} velas no masterParts`);
  console.log(`   ${compatCount} compatibilidades cadastradas`);
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});