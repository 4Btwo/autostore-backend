/**
 * SEED MAHLE — Filtros de Óleo
 * Fonte: Catálogo Oficial Mahle Metal Leve Brasil
 * Cobre os carros mais vendidos do Brasil: VW, Fiat, GM, Ford, Renault, Honda, Hyundai
 *
 * Roda com: node scripts/seedMahle.js
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

const CATEGORY_ID = "cat_filtros_oleo";

// ── Dados Mahle reais ────────────────────────────────────────────────────────
const filtros = [

  // ── OC250 — VW Gol, Fox, Parati, Saveiro, Golf 1.0/1.6 ──────────────────
  {
    oemNumber: "MAHLE-OC250",
    name: "Filtro de Óleo Mahle OC250",
    description: "Filtro de óleo para motores EA111 1.0 e 1.6 VW. Um dos filtros mais utilizados no Brasil.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 8v EA111", fuel: "Flex", yearFrom: 1996, yearTo: 2016 },
      { brand: "Volkswagen", model: "Gol", engine: "1.6 8v EA111 VHT", fuel: "Flex", yearFrom: 2008, yearTo: 2018 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 8v EA111", fuel: "Flex", yearFrom: 2003, yearTo: 2017 },
      { brand: "Volkswagen", model: "Fox", engine: "1.6 8v EA111", fuel: "Flex", yearFrom: 2003, yearTo: 2021 },
      { brand: "Volkswagen", model: "Parati", engine: "1.0 16v EA111", fuel: "Flex", yearFrom: 1997, yearTo: 2006 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 8v EA111", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "CrossFox", engine: "1.6 8v EA111", fuel: "Flex", yearFrom: 2005, yearTo: 2017 },
      { brand: "Volkswagen", model: "Golf", engine: "1.6 8v EA111", fuel: "Flex", yearFrom: 2001, yearTo: 2014 },
      { brand: "Volkswagen", model: "Kombi", engine: "1.4 8v EA111", fuel: "Flex", yearFrom: 2006, yearTo: 2013 },
    ],
  },

  // ── OC1449 — VW UP, Polo, Virtus, Gol G6, T-Cross 1.0/1.6 TSI ───────────
  {
    oemNumber: "MAHLE-OC1449",
    name: "Filtro de Óleo Mahle OC1449",
    description: "Filtro de óleo para motores EA211 1.0 e 1.6 VW. Para linha Gol G6 em diante e plataforma MQB.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.6 16v EA211 MSI", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.6 16v EA211", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 12v EA211", fuel: "Flex", yearFrom: 2013, yearTo: 2017 },
      { brand: "Volkswagen", model: "Fox", engine: "1.6 16v EA211", fuel: "Flex", yearFrom: 2014, yearTo: 2017 },
      { brand: "Volkswagen", model: "Up!", engine: "1.0 12v Flex", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Up!", engine: "1.0 12v TSI Turbo", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Golf", engine: "1.4 TSI EA211", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Volkswagen", model: "Polo", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "Virtus", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Volkswagen", model: "T-Cross", engine: "1.0 TSI", fuel: "Flex", yearFrom: 2019, yearTo: null },
    ],
  },

  // ── OC90 — GM Onix, Prisma, Classic, Agile, Cobalt 1.0/1.4/1.8 ──────────
  {
    oemNumber: "MAHLE-OC90",
    name: "Filtro de Óleo Mahle OC90",
    description: "Filtro de óleo para motores GM 1.0, 1.4 e 1.8 Flex. Amplamente usado na linha Onix e Prisma.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Onix", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 8v Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Chevrolet", model: "Agile", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 8v Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Spin", engine: "1.8 8v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Chevrolet", model: "Astra", engine: "2.0 8v Flex", fuel: "Flex", yearFrom: 1999, yearTo: 2011 },
    ],
  },

  // ── OC1016D — GM Onix Plus, Tracker, Cruze 1.0 Turbo ────────────────────
  {
    oemNumber: "MAHLE-OC1016D",
    name: "Filtro de Óleo Mahle OC1016D",
    description: "Filtro de óleo para motores turbo 1.0 e 1.4 GM nova geração.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Chevrolet", model: "Montana", engine: "1.2 Turbo", fuel: "Flex", yearFrom: 2023, yearTo: null },
      { brand: "Chevrolet", model: "Cruze", engine: "1.4 Turbo", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },

  // ── OC1018D — GM Cruze, Sonic, Tracker 1.8 ───────────────────────────────
  {
    oemNumber: "MAHLE-OC1018D",
    name: "Filtro de Óleo Mahle OC1018D",
    description: "Filtro de óleo para motores GM 1.8 Ecotec Flex.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Cruze", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2011, yearTo: 2016 },
      { brand: "Chevrolet", model: "Sonic", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2015 },
      { brand: "Chevrolet", model: "Tracker", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2016 },
      { brand: "Chevrolet", model: "Cruze Sport6", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2016 },
    ],
  },

  // ── OC600 — Honda Fit, City, Civic, HR-V, CR-V ───────────────────────────
  {
    oemNumber: "MAHLE-OC600",
    name: "Filtro de Óleo Mahle OC600",
    description: "Filtro de óleo para motores Honda 1.5 e 2.0 Flex. Cobre toda a linha Honda popular.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "Civic", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: 2016 },
      { brand: "Honda", model: "Civic", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Honda", model: "HR-V", engine: "1.8 16v Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Honda", model: "CR-V", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: 2017 },
    ],
  },

  // ── OC506 — Fiat Argo, Cronos, Mobi, Palio Fire ──────────────────────────
  {
    oemNumber: "MAHLE-OC506",
    name: "Filtro de Óleo Mahle OC506",
    description: "Filtro de óleo para motores Fiat Fire e Firefly 1.0, 1.3 e 1.4. O mais popular da linha Fiat.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2016 },
      { brand: "Fiat", model: "Palio", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 8v Fire EVO", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Grand Siena", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 8v Fire EVO", fuel: "Flex", yearFrom: 2013, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 8v Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },

  // ── OC261 — Fiat Ducato, Jumper, Boxer Diesel ────────────────────────────
  {
    oemNumber: "MAHLE-OC261",
    name: "Filtro de Óleo Mahle OC261",
    description: "Filtro de óleo para motores Fiat/Iveco 2.3 MultiJet Diesel. Para vans e utilitários.",
    brand: "Mahle",
    weightKg: 0.25,
    applications: [
      { brand: "Fiat", model: "Ducato", engine: "2.3 MultiJet Diesel", fuel: "Diesel", yearFrom: 2009, yearTo: null },
      { brand: "Peugeot", model: "Boxer", engine: "2.3 HDi Diesel", fuel: "Diesel", yearFrom: 2010, yearTo: null },
      { brand: "Citroën", model: "Jumper", engine: "2.3 HDi Diesel", fuel: "Diesel", yearFrom: 2010, yearTo: null },
    ],
  },

  // ── OC195 — Renault Kwid, Sandero, Logan, Clio ───────────────────────────
  {
    oemNumber: "MAHLE-OC195",
    name: "Filtro de Óleo Mahle OC195",
    description: "Filtro de óleo para motores Renault 1.0 SCe e 1.6 16v Flex.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Clio", engine: "1.0 16v Flex", fuel: "Flex", yearFrom: 2006, yearTo: 2012 },
      { brand: "Renault", model: "Clio", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2006, yearTo: 2012 },
      { brand: "Renault", model: "Duster", engine: "1.6 16v Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },

  // ── OC1222 — Hyundai HB20, HB20S, Tucson ─────────────────────────────────
  {
    oemNumber: "MAHLE-OC1222",
    name: "Filtro de Óleo Mahle OC1222",
    description: "Filtro de óleo para motores Hyundai/Kia 1.0, 1.6 e 2.0 Flex.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "HB20S", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Hyundai", model: "Tucson", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2006, yearTo: 2015 },
      { brand: "Kia", model: "Picanto", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Kia", model: "Soul", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },

  // ── OC304 — Ford Ka, Fiesta, EcoSport 1.0/1.5/1.6 Flex ───────────────────
  {
    oemNumber: "MAHLE-OC304",
    name: "Filtro de Óleo Mahle OC304",
    description: "Filtro de óleo para motores Ford Sigma 1.0, Rocam 1.6 e Dragon 1.5 Flex.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2014 },
      { brand: "Ford", model: "Ka", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2014 },
      { brand: "Ford", model: "Ka", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "Fiesta", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
      { brand: "Ford", model: "Fiesta", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2013 },
      { brand: "Ford", model: "EcoSport", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2012 },
      { brand: "Ford", model: "EcoSport", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ── OC169/1D — Ford Ranger, Troller 2.5/3.0 Diesel ───────────────────────
  {
    oemNumber: "MAHLE-OC169D",
    name: "Filtro de Óleo Mahle OC169/1D",
    description: "Filtro de óleo para motores Ford Duratorq 2.5 e 3.0 TDCI Diesel.",
    brand: "Mahle",
    weightKg: 0.25,
    applications: [
      { brand: "Ford", model: "Ranger", engine: "2.5 TDCI Diesel", fuel: "Diesel", yearFrom: 2004, yearTo: 2010 },
      { brand: "Ford", model: "Ranger", engine: "3.0 TDCI Diesel", fuel: "Diesel", yearFrom: 2004, yearTo: 2010 },
      { brand: "Ford", model: "Troller", engine: "3.0 TDCI Diesel", fuel: "Diesel", yearFrom: 2006, yearTo: 2011 },
    ],
  },

  // ── OC974D — GM Captiva, Malibu 2.4 ──────────────────────────────────────
  {
    oemNumber: "MAHLE-OC974D",
    name: "Filtro de Óleo Mahle OC974D",
    description: "Filtro de óleo para motores GM 2.4 Ecotec e 3.0 V6.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Captiva", engine: "2.4 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2016 },
      { brand: "Chevrolet", model: "Malibu", engine: "2.4 16v Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2015 },
      { brand: "Chevrolet", model: "Captiva Sport", engine: "3.0 V6 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2012 },
    ],
  },

  // ── OC1032D — Toyota Corolla, Yaris, Etios ───────────────────────────────
  {
    oemNumber: "MAHLE-OC1032D",
    name: "Filtro de Óleo Mahle OC1032D",
    description: "Filtro de óleo para motores Toyota 1.3, 1.5 e 2.0 Flex.",
    brand: "Mahle",
    weightKg: 0.2,
    applications: [
      { brand: "Toyota", model: "Corolla", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2008, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Toyota", model: "Etios", engine: "1.3 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Etios", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "RAV4", engine: "2.0 16v Flex", fuel: "Flex", yearFrom: 2013, yearTo: null },
    ],
  },
];

// ── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  console.log("🚀 Iniciando seed Mahle Filtros de Óleo...\n");

  await db.collection("categories").doc(CATEGORY_ID).set({
    name: "Filtros de Óleo",
    icon: "🛢️",
    active: true,
  }, { merge: true });
  console.log("✅ Categoria: Filtros de Óleo");

  let masterCount = 0;
  let compatCount = 0;

  for (const filtro of filtros) {
    const { applications, ...partData } = filtro;

    const masterRef = db.collection("masterParts").doc(
      filtro.oemNumber.replace(/[^a-zA-Z0-9]/g, "_")
    );
    await masterRef.set({
      ...partData,
      categoryId: CATEGORY_ID,
      categoryName: "Filtros de Óleo",
      active: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    masterCount++;
    console.log(`  ✅ masterPart: ${filtro.oemNumber} — ${filtro.name}`);

    for (const app of applications) {
      const compatId = `${filtro.oemNumber}_${app.brand}_${app.model}_${app.engine}`
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();

      await db.collection("compatibilities").doc(compatId).set({
        masterPartId: masterRef.id,
        oemNumber: filtro.oemNumber,
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
  console.log(`   ${masterCount} filtros no masterParts`);
  console.log(`   ${compatCount} compatibilidades cadastradas`);
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});