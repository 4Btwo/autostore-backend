/**
 * SEED GATES — Correias Dentadas + Kits
 * Fonte: Catálogo Gates Brasil + referências AsllanAutopeças / AdecarRolamentos
 * Roda com: node scripts/seedGates.js
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const CATEGORY_ID = "cat_correias_dentadas";

const correias = [
  {
    oemNumber: "GATES-KS105",
    name: "Kit Correia Dentada Gates KS105",
    description: "Kit correia dentada + tensor + polia para VW 1.0 16v. Inclui 2 correias, 2 tensores e 2 polias.",
    brand: "Gates", weightKg: 0.6,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 16v EA111", fuel: "Flex", yearFrom: 2002, yearTo: 2012 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 16v EA111", fuel: "Flex", yearFrom: 2002, yearTo: 2006 },
      { brand: "Volkswagen", model: "Polo", engine: "1.0 16v EA111", fuel: "Flex", yearFrom: 2003, yearTo: 2009 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 16v EA111", fuel: "Flex", yearFrom: 2004, yearTo: 2009 },
    ],
  },
  {
    oemNumber: "GATES-KS226",
    name: "Kit Correia Dentada Gates KS226",
    description: "Kit correia dentada para VW 1.6 8v e 1.8 8v AP — Gol, Parati, Saveiro.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.6 8v AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 2000 },
      { brand: "Volkswagen", model: "Parati", engine: "1.6 8v AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 2000 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.6 8v AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 2000 },
      { brand: "Volkswagen", model: "Santana", engine: "1.8 8v AP", fuel: "Gasolina", yearFrom: 1984, yearTo: 1997 },
    ],
  },
  {
    oemNumber: "GATES-KS258",
    name: "Kit Correia Dentada Gates KS258",
    description: "Kit correia para Fiat 1.0 Fire e 1.4 Fire EVO — Palio, Uno, Siena, Mobi.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire", fuel: "Flex", yearFrom: 2001, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 8v Fire", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 8v Fire", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 8v Fire", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Doblò", engine: "1.3 8v Fire", fuel: "Gasolina", yearFrom: 2002, yearTo: 2006 },
    ],
  },
  {
    oemNumber: "GATES-KS218",
    name: "Kit Correia Dentada Gates KS218",
    description: "Kit correia para Fiat 1.8 16v E.torQ — Bravo, Linea, Idea, Doblò.",
    brand: "Gates", weightKg: 0.6,
    applications: [
      { brand: "Fiat", model: "Bravo", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Fiat", model: "Linea", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
      { brand: "Fiat", model: "Idea", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2011, yearTo: 2016 },
      { brand: "Fiat", model: "Doblò", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Fiat", model: "Toro", engine: "1.8 16v E.torQ", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  {
    oemNumber: "GATES-KS404",
    name: "Kit Correia Dentada Gates KS404",
    description: "Kit correia para Ford Ka 1.0 Ti-VCT e Fiesta 1.0 EcoBoost.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 Ti-VCT Flex", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.0 Ti-VCT Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Fiesta", engine: "1.0 EcoBoost", fuel: "Gasolina", yearFrom: 2016, yearTo: 2019 },
    ],
  },
  {
    oemNumber: "GATES-K015PK1455",
    name: "Correia Micro-V Gates K015PK1455",
    description: "Correia poly-V acessórios para Fiat Argo, Cronos e Mobi Firefly.",
    brand: "Gates", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 / 1.3 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  {
    oemNumber: "GATES-KS288",
    name: "Kit Correia Dentada Gates KS288",
    description: "Kit correia para Renault 1.0 16v e 1.6 16v — Sandero, Logan, Clio, Duster.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Clio", engine: "1.0 / 1.6 16v Flex", fuel: "Flex", yearFrom: 2006, yearTo: 2012 },
      { brand: "Renault", model: "Duster", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
  {
    oemNumber: "GATES-KS316",
    name: "Kit Correia Dentada Gates KS316",
    description: "Kit correia para Honda Fit, City e WR-V 1.5 16v Flex.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },
  {
    oemNumber: "GATES-KS365",
    name: "Kit Correia Dentada Gates KS365",
    description: "Kit correia para Toyota Etios 1.3 e 1.5 16v Flex.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Toyota", model: "Etios", engine: "1.3 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Etios", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },
  {
    oemNumber: "GATES-KS330",
    name: "Kit Correia Dentada Gates KS330",
    description: "Kit correia para Hyundai HB20 e HB20S 1.0 e 1.6 Flex.",
    brand: "Gates", weightKg: 0.5,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Kia", model: "Picanto", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed Gates Correias Dentadas...\n");
  await db.collection("categories").doc(CATEGORY_ID).set({ name: "Correias Dentadas", icon: "⚙️", active: true }, { merge: true });
  console.log("✅ Categoria: Correias Dentadas");
  let masterCount = 0, compatCount = 0;
  for (const item of correias) {
    const { applications, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({ ...partData, categoryId: CATEGORY_ID, categoryName: "Correias Dentadas", active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    masterCount++;
    console.log(`  ✅ ${item.oemNumber}`);
    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({ masterPartId: masterRef.id, oemNumber: item.oemNumber, brand: app.brand, model: app.model, engine: app.engine, fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }
  console.log(`\n🎉 Seed concluído! ${masterCount} correias | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
