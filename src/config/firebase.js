import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  let serviceAccount;

  // Produção (Render): chave em base64 via env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8");
    serviceAccount = JSON.parse(json);
  }
  // Desenvolvimento local
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Resolve relativo ao diretório onde o processo foi iniciado (a pasta backend)
    const keyPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    console.log("🔑 Carregando credenciais de:", keyPath);
    
    if (!fs.existsSync(keyPath)) {
      throw new Error(`❌ serviceAccountKey.json não encontrado em: ${keyPath}`);
    }
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  } else {
    throw new Error("❌ Nenhuma credencial Firebase encontrada.");
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  console.log("✅ Firebase Admin inicializado");
}

const db = admin.firestore();
export { admin, db };
