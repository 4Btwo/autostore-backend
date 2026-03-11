/**
 * DIAGNÓSTICO — Verifica o que está no Firestore
 * Roda com: node --env-file=.env scripts/debug.js
 */
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const keyPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function debug() {
  console.log("🔍 Listando vehicleTechnicals...\n");
  const snap = await db.collection("vehicleTechnicals").get();
  
  if (snap.empty) {
    console.log("❌ NENHUM vehicleTechnical encontrado no Firestore!");
  } else {
    snap.docs.forEach(doc => {
      console.log("ID:", doc.id);
      console.log("Dados:", JSON.stringify(doc.data(), null, 2));
      console.log("---");
    });
  }

  console.log("\n🔍 Listando technicalCompatibilities...\n");
  const snap2 = await db.collection("technicalCompatibilities").get();
  if (snap2.empty) {
    console.log("❌ NENHUMA compatibilidade encontrada!");
  } else {
    snap2.docs.forEach(doc => {
      console.log("ID:", doc.id, "→", doc.data().vehicleTechnicalId, "→", doc.data().masterPartId);
    });
  }

  process.exit(0);
}

debug().catch(err => { console.error(err); process.exit(1); });
