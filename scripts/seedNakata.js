/**
 * SEED NAKATA — Terminais de Direção, Pivôs, Bandejas e Bieletas
 * Fonte: Catálogo Nakata 2024 + catalogonakata.com.br + Balcão Automotivo
 * Roda com: node scripts/seedNakata.js
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

  // ═══════════════════════════════════════════════════════════════════════════
  // TERMINAIS DE DIREÇÃO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N6016",
    name: "Terminal de Direção Nakata N6016",
    description: "Terminal de direção direito/esquerdo para Fiat Palio, Siena, Strada, Uno, Mobi, Argo e Cronos.",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "Todos", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "Todos", fuel: "Flex", yearFrom: 1996, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "Todos", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Doblò", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N6040",
    name: "Terminal de Direção Nakata N6040",
    description: "Terminal de direção para Fiat Argo, Cronos e Strada nova geração (2017 em diante).",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "Todos", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N2190",
    name: "Terminal de Direção Nakata N2190",
    description: "Terminal de direção para VW Gol G1 a G4, Parati, Saveiro, Voyage e Santana.",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Gasolina", yearFrom: 1981, yearTo: 2005 },
      { brand: "Volkswagen", model: "Parati", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 2005 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 2005 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Gasolina", yearFrom: 1982, yearTo: 1995 },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N2290",
    name: "Terminal de Direção Nakata N2290",
    description: "Terminal de direção para VW Gol G5/G6/G7, Fox, CrossFox, SpaceFox e Voyage.",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Fox", engine: "Todos", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "SpaceFox", engine: "Todos", fuel: "Flex", yearFrom: 2006, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2016 },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N2340",
    name: "Terminal de Direção Nakata N2340",
    description: "Terminal de direção para VW Polo, Virtus, T-Cross e Nivus (plataforma MQB).",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Volkswagen", model: "Polo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "Todos", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Volkswagen", model: "Nivus", engine: "Todos", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N4015",
    name: "Terminal de Direção Nakata N4015",
    description: "Terminal de direção para GM Onix, Prisma, Cobalt e Agile Flex.",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Agile", engine: "Todos", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N4050",
    name: "Terminal Axial Nakata N4050",
    description: "Terminal axial para GM Onix Turbo, Tracker e Montana nova geração.",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N7020",
    name: "Terminal de Direção Nakata N7020",
    description: "Terminal de direção para Renault Sandero, Logan, Kwid e Duster Flex.",
    brand: "Nakata", type: "Terminal de Direção", weightKg: 0.3,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "Todos", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "Todos", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Renault", model: "Oroch", engine: "Todos", fuel: "Flex", yearFrom: 2015, yearTo: null },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PIVÔS DE SUSPENSÃO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N880",
    name: "Pivô de Suspensão Nakata N880",
    description: "Pivô de suspensão dianteiro para Fiat Palio, Siena, Strada, Uno e Doblò Fire.",
    brand: "Nakata", type: "Pivô de Suspensão", weightKg: 0.4,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Doblò", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N882",
    name: "Pivô de Suspensão Nakata N882",
    description: "Pivô de suspensão dianteiro para Fiat Argo, Cronos e Strada nova (com pivô, 2017+).",
    brand: "Nakata", type: "Pivô de Suspensão", weightKg: 0.4,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.3 / 1.4 Firefly", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N875",
    name: "Pivô de Suspensão Nakata N875",
    description: "Pivô de suspensão dianteiro para GM Onix, Prisma, Cobalt e Spin.",
    brand: "Nakata", type: "Pivô de Suspensão", weightKg: 0.4,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Spin", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BIELETAS DE BARRA ESTABILIZADORA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N3066",
    name: "Bieleta Dianteira Nakata N3066",
    description: "Bieleta da barra estabilizadora dianteira para VW Gol G5/G6/G7, Fox, CrossFox, Voyage.",
    brand: "Nakata", type: "Bieleta", weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2018 },
      { brand: "Volkswagen", model: "Voyage", engine: "Todos", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Fox", engine: "Todos", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "Todos", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N3088",
    name: "Bieleta Dianteira Nakata N3088",
    description: "Bieleta da barra estabilizadora dianteira para Fiat Argo, Cronos, Mobi e Toro.",
    brand: "Nakata", type: "Bieleta", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "Todos", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Toro", engine: "Todos", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N3055",
    name: "Bieleta Dianteira Nakata N3055",
    description: "Bieleta da barra estabilizadora dianteira para GM Onix, Prisma e Cobalt.",
    brand: "Nakata", type: "Bieleta", weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "Todos", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "Todos", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-N3070",
    name: "Bieleta Dianteira Nakata N3070",
    description: "Bieleta dianteira para Hyundai HB20, HB20S e Creta.",
    brand: "Nakata", type: "Bieleta", weightKg: 0.2,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "Todos", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "Creta", engine: "Todos", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BANDEJAS DE SUSPENSÃO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-AC30783",
    name: "Bandeja de Suspensão Nakata AC30783",
    description: "Bandeja dianteira inferior com bucha e coxim para Fiat Palio, Siena, Strada e Uno.",
    brand: "Nakata", type: "Bandeja", weightKg: 1.5,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: 2016 },
      { brand: "Fiat", model: "Siena", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Uno", engine: "Todos", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Doblò", engine: "Todos", fuel: "Flex", yearFrom: 2001, yearTo: null },
    ],
  },
  {
    categoryId: "cat_suspensao_direcao", categoryName: "Suspensão e Direção",
    oemNumber: "NAKATA-AC30801",
    name: "Bandeja de Suspensão Nakata AC30801",
    description: "Bandeja dianteira inferior com bucha e coxim e pivô para Fiat Argo, Cronos e Strada nova.",
    brand: "Nakata", type: "Bandeja", weightKg: 1.5,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "Todos", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "Todos", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.3 / 1.4 Firefly", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed Nakata Suspensão e Direção...\n");
  await db.collection("categories").doc("cat_suspensao_direcao").set({ name: "Suspensão e Direção", icon: "🔧", active: true }, { merge: true });
  console.log("✅ Categoria: Suspensão e Direção");

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
