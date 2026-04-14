/**
 * SEED DELPHI — Injetores de Combustível
 * Fonte: Catálogo Delphi Brasil + nota de lançamentos Delphi Technologies 2021
 * Roda com: node scripts/seedDelphi.js
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
const CATEGORY_ID = "cat_injetores";

const injetores = [

  // ── FIAT Fire / Firefly ───────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25009",
    name: "Injetor de Combustível Delphi GDI25009",
    description: "Injetor MPI para motores Fiat Fire 1.0 e 1.4 Flex. Fabricado no Brasil, padrão OEM.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 8v Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 8v Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },
  {
    oemNumber: "DELPHI-GDI25025",
    name: "Injetor de Combustível Delphi GDI25025",
    description: "Injetor MPI para Fiat Argo, Cronos e Mobi Firefly 1.0 e 1.3 Flex.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── VW EA111 ──────────────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25011",
    name: "Injetor de Combustível Delphi GDI25011",
    description: "Injetor MPI para VW EA111 1.0 8v e 1.6 8v Flex — Gol, Fox, Saveiro.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2006 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
    ],
  },
  {
    oemNumber: "DELPHI-GDI25018",
    name: "Injetor de Combustível Delphi GDI25018",
    description: "Injetor MPI para VW EA111 1.6 16v e Golf/Polo 1.6 Flex.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.6 16v EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.6 8v EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "CrossFox", engine: "1.6 8v EA111 Flex", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "Golf", engine: "1.6 8v EA111 Flex", fuel: "Flex", yearFrom: 2001, yearTo: 2014 },
    ],
  },

  // ── GM Onix / Prisma ──────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25031",
    name: "Injetor de Combustível Delphi GDI25031",
    description: "Injetor MPI para GM Onix, Prisma e Cobalt 1.0/1.4 Flex. OEM GM original.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Onix", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
    ],
  },
  {
    oemNumber: "DELPHI-GDI25045",
    name: "Injetor de Combustível Delphi GDI25045",
    description: "Injetor GDI para GM Onix Turbo e Tracker 1.0 Turbo nova geração.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
    ],
  },

  // ── Honda ─────────────────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25022",
    name: "Injetor de Combustível Delphi GDI25022",
    description: "Injetor MPI para Honda City, Fit e WR-V 1.5 16v Flex. Peça original OEM Honda.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Honda", model: "HR-V", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
    ],
  },

  // ── Toyota ────────────────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25038",
    name: "Injetor de Combustível Delphi GDI25038",
    description: "Injetor MPI para Toyota Corolla, Etios e Yaris Flex.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Toyota", model: "Corolla", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Toyota", model: "Etios", engine: "1.3 / 1.5 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },

  // ── Hyundai / Kia ─────────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25033",
    name: "Injetor de Combustível Delphi GDI25033",
    description: "Injetor MPI para Hyundai HB20 1.0 e 1.6 Flex. Lançamento Delphi Technologies 2021.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2015, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2015, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2015, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20S", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2015, yearTo: 2019 },
      { brand: "Hyundai", model: "Creta", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Hyundai", model: "Creta", engine: "2.0 Flex", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── Renault ───────────────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25015",
    name: "Injetor de Combustível Delphi GDI25015",
    description: "Injetor MPI para Renault Kwid 1.0 SCe, Sandero e Logan 1.0/1.6 Flex.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },

  // ── Ford ──────────────────────────────────────────────────────────────────
  {
    oemNumber: "DELPHI-GDI25020",
    name: "Injetor de Combustível Delphi GDI25020",
    description: "Injetor MPI para Ford Ka, Ka+, Fiesta e EcoSport Dragon 1.5 Flex.",
    brand: "Delphi", weightKg: 0.15,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "EcoSport", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Ford", model: "Ka", engine: "1.0 Ti-VCT Flex", fuel: "Flex", yearFrom: 2014, yearTo: null },
    ],
  },
];

async function seed() {
  console.log("🚀 Iniciando seed Delphi Injetores...\n");
  await db.collection("categories").doc(CATEGORY_ID).set({ name: "Injetores", icon: "💉", active: true }, { merge: true });
  console.log("✅ Categoria: Injetores");
  let masterCount = 0, compatCount = 0;
  for (const item of injetores) {
    const { applications, ...partData } = item;
    const masterRef = db.collection("masterParts").doc(item.oemNumber.replace(/[^a-zA-Z0-9]/g, "_"));
    await masterRef.set({ ...partData, categoryId: CATEGORY_ID, categoryName: "Injetores", active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    masterCount++;
    console.log(`  ✅ ${item.oemNumber}`);
    for (const app of applications) {
      const compatId = `${item.oemNumber}_${app.brand}_${app.model}_${app.engine}`.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      await db.collection("compatibilities").doc(compatId).set({ masterPartId: masterRef.id, oemNumber: item.oemNumber, brand: app.brand, model: app.model, engine: app.engine, fuel: app.fuel, yearFrom: app.yearFrom, yearTo: app.yearTo, active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      compatCount++;
    }
    console.log(`     └─ ${applications.length} aplicações`);
  }
  console.log(`\n🎉 Seed concluído! ${masterCount} injetores | ${compatCount} compatibilidades`);
  process.exit(0);
}
seed().catch(err => { console.error("❌ Erro:", err); process.exit(1); });
