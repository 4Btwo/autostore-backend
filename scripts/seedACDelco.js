/**
 * SEED ACDELCO — Velas de Ignição GM + Mahle Juntas de Cabeçote
 * Fonte: Catálogo ACDelco Brasil + Mahle Metal Leve Aftermarket
 * Roda com: node scripts/seedACDelco.js
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const pecas = [

  // ═══════════════════════════════════════════════════════════════════════════
  // VELAS DE IGNIÇÃO ACDELCO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_velas_ignicao", categoryName: "Velas de Ignição",
    oemNumber: "ACDELCO-R42XLS",
    name: "Vela de Ignição ACDelco R42XLS",
    description: "Vela de ignição cobre para GM Onix 1.0/1.4 e Prisma 1.0/1.4 Flex. OEM original GM.",
    brand: "ACDelco", weightKg: 0.05,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Chevrolet", model: "Agile", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
    ],
  },
  {
    categoryId: "cat_velas_ignicao", categoryName: "Velas de Ignição",
    oemNumber: "ACDELCO-41601",
    name: "Vela de Ignição ACDelco 41-601 Iridium",
    description: "Vela de ignição iridium para GM Onix Turbo, Tracker 1.0T e Montana nova geração.",
    brand: "ACDelco", weightKg: 0.05,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Onix Plus", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2019, yearTo: null },
      { brand: "Chevrolet", model: "Tracker", engine: "1.0 Turbo", fuel: "Flex", yearFrom: 2020, yearTo: null },
      { brand: "Chevrolet", model: "Montana", engine: "1.2 Turbo", fuel: "Flex", yearFrom: 2023, yearTo: null },
    ],
  },
  {
    categoryId: "cat_velas_ignicao", categoryName: "Velas de Ignição",
    oemNumber: "ACDELCO-R43XLS",
    name: "Vela de Ignição ACDelco R43XLS",
    description: "Vela de ignição para GM Spin 1.8 e Cobalt 1.8 Flex.",
    brand: "ACDelco", weightKg: 0.05,
    applications: [
      { brand: "Chevrolet", model: "Spin", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Chevrolet", model: "Astra", engine: "1.8 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2011 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JUNTAS DE CABEÇOTE MAHLE METAL LEVE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC326",
    name: "Junta de Cabeçote Mahle JC326",
    description: "Junta de cabeçote multicamadas para motores Fiat Fire 1.0 8v e 1.4 8v Flex.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2001, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 8v Fire Flex", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 8v Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Fiat", model: "Fiorino", engine: "1.3 8v Fire Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC396",
    name: "Junta de Cabeçote Mahle JC396",
    description: "Junta de cabeçote para motores Fiat Firefly 1.0 e 1.3 Flex (Argo, Cronos, Mobi).",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Fiat", model: "Argo", engine: "1.0 6v / 1.3 8v Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Cronos", engine: "1.3 8v Firefly", fuel: "Flex", yearFrom: 2018, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 6v Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC282",
    name: "Junta de Cabeçote Mahle JC282",
    description: "Junta de cabeçote para motores VW EA111 1.0 8v e 1.6 8v Flex — Gol, Fox, Saveiro.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 8v EA111 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC302",
    name: "Junta de Cabeçote Mahle JC302",
    description: "Junta de cabeçote para motores GM ECOTEC 1.0 e 1.4 Flex — Onix, Prisma, Cobalt.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 ECOTEC Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 ECOTEC Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 ECOTEC Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
      { brand: "Chevrolet", model: "Classic", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2010, yearTo: 2016 },
      { brand: "Chevrolet", model: "Agile", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2009, yearTo: 2014 },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC348",
    name: "Junta de Cabeçote Mahle JC348",
    description: "Junta de cabeçote para motores Renault 1.0 SCe e 1.6 Flex — Kwid, Sandero, Logan.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Renault", model: "Kwid", engine: "1.0 SCe Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 16v Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC364",
    name: "Junta de Cabeçote Mahle JC364",
    description: "Junta de cabeçote para motores Honda 1.5 16v L15 Flex — Fit, City e WR-V.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Honda", model: "Fit", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "City", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2009, yearTo: null },
      { brand: "Honda", model: "WR-V", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC372",
    name: "Junta de Cabeçote Mahle JC372",
    description: "Junta de cabeçote para motores Hyundai 1.0 e 1.6 Kappa Flex — HB20, HB20S, Creta.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Hyundai", model: "HB20", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "HB20S", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Hyundai", model: "Creta", engine: "1.6 Flex", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Kia", model: "Picanto", engine: "1.0 Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC338",
    name: "Junta de Cabeçote Mahle JC338",
    description: "Junta de cabeçote para motores Toyota 1NZ/2NZ — Etios 1.3/1.5 e Yaris Flex.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Toyota", model: "Etios", engine: "1.3 / 1.5 16v Flex", fuel: "Flex", yearFrom: 2012, yearTo: null },
      { brand: "Toyota", model: "Yaris", engine: "1.5 16v Flex", fuel: "Flex", yearFrom: 2018, yearTo: null },
    ],
  },
  {
    categoryId: "cat_juntas", categoryName: "Juntas",
    oemNumber: "MAHLE-JC312",
    name: "Junta de Cabeçote Mahle JC312",
    description: "Junta de cabeçote para Ford Ka/Fiesta 1.0 Ti-VCT e Ka/EcoSport 1.5 Dragon Flex.",
    brand: "Mahle", weightKg: 0.2,
    applications: [
      { brand: "Ford", model: "Ka", engine: "1.0 Ti-VCT / 1.5 Dragon Flex", fuel: "Flex", yearFrom: 2014, yearTo: null },
      { brand: "Ford", model: "Ka+", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2015, yearTo: null },
      { brand: "Ford", model: "EcoSport", engine: "1.5 Dragon Flex", fuel: "Flex", yearFrom: 2017, yearTo: null },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KITS DE EMBREAGEM VALEO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryId: "cat_embreagem", categoryName: "Embreagem",
    oemNumber: "VALEO-826434",
    name: "Kit de Embreagem Valeo 826434",
    description: "Kit completo de embreagem (disco + platô + rolamento) para Fiat Fire e Firefly 1.0/1.4 Flex.",
    brand: "Valeo", weightKg: 3.5,
    applications: [
      { brand: "Fiat", model: "Palio", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2001, yearTo: 2016 },
      { brand: "Fiat", model: "Uno", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2010, yearTo: null },
      { brand: "Fiat", model: "Siena", engine: "1.0 / 1.4 Fire Flex", fuel: "Flex", yearFrom: 2001, yearTo: null },
      { brand: "Fiat", model: "Argo", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2017, yearTo: null },
      { brand: "Fiat", model: "Mobi", engine: "1.0 Firefly", fuel: "Flex", yearFrom: 2016, yearTo: null },
      { brand: "Fiat", model: "Strada", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
    ],
  },
  {
    categoryId: "cat_embreagem", categoryName: "Embreagem",
    oemNumber: "VALEO-826506",
    name: "Kit de Embreagem Valeo 826506",
    description: "Kit completo de embreagem para VW EA111 1.0 e 1.6 Flex — Gol, Fox, Saveiro.",
    brand: "Valeo", weightKg: 3.5,
    applications: [
      { brand: "Volkswagen", model: "Gol", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Fox", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2004, yearTo: 2017 },
      { brand: "Volkswagen", model: "Saveiro", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2003, yearTo: 2016 },
      { brand: "Volkswagen", model: "Voyage", engine: "1.0 / 1.6 EA111 Flex", fuel: "Flex", yearFrom: 2008, yearTo: 2016 },
    ],
  },
  {
    categoryId: "cat_embreagem", categoryName: "Embreagem",
    oemNumber: "VALEO-826456",
    name: "Kit de Embreagem Valeo 826456",
    description: "Kit completo de embreagem para GM Onix, Prisma e Cobalt 1.0/1.4 Flex.",
    brand: "Valeo", weightKg: 3.5,
    applications: [
      { brand: "Chevrolet", model: "Onix", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2012, yearTo: 2019 },
      { brand: "Chevrolet", model: "Prisma", engine: "1.0 / 1.4 Flex", fuel: "Flex", yearFrom: 2013, yearTo: 2019 },
      { brand: "Chevrolet", model: "Cobalt", engine: "1.4 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
  {
    categoryId: "cat_embreagem", categoryName: "Embreagem",
    oemNumber: "VALEO-826480",
    name: "Kit de Embreagem Valeo 826480",
    description: "Kit completo de embreagem para Renault Sandero, Logan e Duster 1.6 Flex.",
    brand: "Valeo", weightKg: 3.5,
    applications: [
      { brand: "Renault", model: "Sandero", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Logan", engine: "1.0 / 1.6 Flex", fuel: "Flex", yearFrom: 2007, yearTo: null },
      { brand: "Renault", model: "Duster", engine: "1.6 / 2.0 Flex", fuel: "Flex", yearFrom: 2011, yearTo: null },
    ],
  },
];

const categorias = {
  cat_velas_ignicao: { name: "Velas de Ignição", icon: "⚡" },
  cat_juntas: { name: "Juntas", icon: "🔩" },
  cat_embreagem: { name: "Embreagem", icon: "🔄" },
};

async function seed() {
  console.log("🚀 Iniciando seed ACDelco Velas + Mahle Juntas + Valeo Embreagem...\n");
  for (const [id, cat] of Object.entries(categorias)) {
    await db.collection("categories").doc(id).set({ ...cat, active: true }, { merge: true });
    console.log(`✅ Categoria: ${cat.name}`);
  }
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
