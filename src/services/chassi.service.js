import { db, admin } from "../config/firebase.js";
import { SUBCOLLECTIONS } from "./desmanche.catalog.js";

// ─── Decodificação básica de VIN (17 chars) ──────────────────────────────────
const WMI_BRANDS = {
  "9BW":"Volkswagen","9BH":"Volkswagen","9BF":"Ford","9BD":"Fiat",
  "9BM":"Mercedes-Benz","8AF":"Chevrolet","8AC":"Chevrolet","9BK":"Honda",
  "93H":"Honda","9BS":"Toyota","93Y":"Toyota","9BR":"Renault",
  "93X":"Nissan","9B3":"Citroën","9B2":"Peugeot","93R":"Jeep",
  "JTD":"Toyota","WVW":"Volkswagen","1FA":"Ford","2FA":"Ford","3FA":"Ford",
};

const VIN_YEAR = {
  "A":1980,"B":1981,"C":1982,"D":1983,"E":1984,"F":1985,"G":1986,"H":1987,
  "J":1988,"K":1989,"L":1990,"M":1991,"N":1992,"P":1993,"R":1994,"S":1995,
  "T":1996,"V":1997,"W":1998,"X":1999,"Y":2000,"1":2001,"2":2002,"3":2003,
  "4":2004,"5":2005,"6":2006,"7":2007,"8":2008,"9":2009,
};

function decodeVinLocally(vin) {
  const v = vin.toUpperCase().replace(/[IOQ]/g, "");
  if (v.length !== 17) return null;
  const wmi = v.substring(0, 3);
  const yearChar = v.charAt(9);
  const brand = WMI_BRANDS[wmi] || "Fabricante desconhecido";
  const year  = VIN_YEAR[yearChar] || null;
  const seq   = v.substring(11);
  return { vin: v, brand, year, wmi, seq };
}

async function queryApiBrasilChassi(vin) {
  const BEARER = process.env.APIBRASIL_BEARER;
  const DEVICE = process.env.APIBRASIL_DEVICE_TOKEN;
  if (!BEARER || !DEVICE || DEVICE === "pendente") return null;
  try {
    const res = await fetch("https://gateway.apibrasil.io/api/v2/vehicles/chassi", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${BEARER}`,
        "DeviceToken":   DEVICE,
      },
      body: JSON.stringify({ chassi: vin }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const r = data?.data || data?.response || data;
    if (!r) return null;
    return {
      vin, source: "apibrasil",
      brand:  r.marca  || r.MARCA  || r.brand,
      model:  r.modelo || r.MODELO || r.model,
      year:   r.ano    || r.ANO    || r.year,
      engine: r.motor  || r.MOTOR  || r.engine,
      fuel:   r.combustivel || r.COMBUSTIVEL || r.fuel,
      color:  r.cor    || r.COR    || r.color,
      chassis: r.chassi || vin,
    };
  } catch { return null; }
}

export async function lookupChassi(vin) {
  const vinClean = vin.toUpperCase().trim().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  if (vinClean.length !== 17)
    throw new Error("Chassi inválido — deve ter exatamente 17 caracteres alfanuméricos");

  // 1. Cache Firestore (30 dias)
  const cacheRef = db.collection("chassiCache").doc(vinClean);
  const cached   = await cacheRef.get();
  if (cached.exists) {
    const d = cached.data();
    const age = Date.now() - d.cachedAt?.toMillis?.();
    if (age < 30 * 24 * 60 * 60 * 1000) return { ...d.vehicle, fromCache: true };
  }

  // 2. API Brasil
  let vehicle = await queryApiBrasilChassi(vinClean);

  // 3. Decodificação local do VIN
  if (!vehicle) {
    const decoded = decodeVinLocally(vinClean);
    if (!decoded) throw new Error("Não foi possível decodificar o chassi");
    vehicle = {
      vin: vinClean, brand: decoded.brand,
      model: `Modelo ${decoded.seq}`, year: decoded.year,
      engine: null, fuel: null, color: null,
      chassis: vinClean, source: "local_decode", mock: true,
    };
  }

  await cacheRef.set({ vehicle, cachedAt: admin.firestore.FieldValue.serverTimestamp() });
  return vehicle;
}

export async function generateDesmancheCatalog(vin, vehicleData) {
  return SUBCOLLECTIONS.map(sub => ({
    id: sub.id, label: sub.label, icon: sub.icon,
    totalParts: sub.parts.length,
    parts: sub.parts.map(p => ({
      ...p, categoryIds: sub.categoryIds, vehicle: vehicleData,
      condition: "used", price: 0,
    })),
  }));
}

// ─── Publicar lote do desmanche vinculando masterParts reais ─────────────────
// FIX CRÍTICO: busca masterPartIds reais por categoryId para que as peças
// apareçam nas buscas por placa do comprador.
export async function publishDesmancheLot({ sellerId, vin, vehicleData, selectedSubcollections, prices = {} }) {
  const results = { created: 0, updated: 0, errors: [] };

  // Pré-carrega masterParts de todas as categorias necessárias em paralelo
  const allCategoryIds = [];
  for (const subId of selectedSubcollections) {
    const sub = SUBCOLLECTIONS.find(s => s.id === subId);
    if (sub) allCategoryIds.push(...sub.categoryIds);
  }
  const uniqueCatIds = [...new Set(allCategoryIds)];

  // Busca masterParts por categoria (chunks de 10 pelo limite do Firestore)
  const masterPartsByCategory = {};
  for (let i = 0; i < uniqueCatIds.length; i += 10) {
    const chunk = uniqueCatIds.slice(i, i + 10);
    const snap = await db.collection("masterParts")
      .where("categoryId", "in", chunk)
      .where("active", "==", true)
      .get();
    snap.docs.forEach(doc => {
      const d = doc.data();
      if (!masterPartsByCategory[d.categoryId]) masterPartsByCategory[d.categoryId] = [];
      masterPartsByCategory[d.categoryId].push({ id: doc.id, ...d });
    });
  }

  // Verifica aprovação automática do vendedor
  const sellerDoc  = await db.collection("users").doc(sellerId).get();
  const sellerData = sellerDoc.exists ? sellerDoc.data() : {};
  const isAutoApproved   = sellerData.isPremium === true || sellerData.sellerVerified === true;
  const moderationStatus = isAutoApproved ? "approved" : "pending";

  const batch = db.batch();
  let batchCount = 0;

  for (const subId of selectedSubcollections) {
    const sub = SUBCOLLECTIONS.find(s => s.id === subId);
    if (!sub) continue;

    for (const part of sub.parts) {
      try {
        // Encontra o masterPart mais adequado para esta peça pela categoria
        let masterPartId   = null;
        let masterPartData = null;

        for (const catId of sub.categoryIds) {
          const candidates = masterPartsByCategory[catId] || [];
          // Tenta match por nome exato ou parcial
          const match = candidates.find(mp =>
            mp.name?.toLowerCase().includes(part.name.toLowerCase()) ||
            part.name.toLowerCase().includes(mp.name?.toLowerCase() || "")
          ) || candidates[0]; // fallback: primeira peça da categoria
          if (match) { masterPartId = match.id; masterPartData = match; break; }
        }

        const partKey = `${subId}_${part.oemRef}`;
        const price   = prices[partKey] || 0;

        const docRef = db.collection("marketplaceParts").doc();
        batch.set(docRef, {
          sellerId,
          masterPartId:      masterPartId || null,   // FIX: vínculo OEM real
          vin,
          vehicleBrand:      vehicleData.brand  || null,
          vehicleModel:      vehicleData.model  || null,
          vehicleYear:       vehicleData.year   || null,
          name:              part.name,
          // oemNumber real do masterPart quando disponível; senão referência do desmanche
          oemNumber:         masterPartData?.oemNumber || `DESMANCHE-${vin.substring(0, 8)}-${part.oemRef}`,
          description:       `Desmanche — ${vehicleData.brand || ""} ${vehicleData.model || ""} ${vehicleData.year || ""}`.trim(),
          categoryId:        sub.categoryIds[0] || null,
          subcollectionId:   sub.id,
          subcollectionLabel:sub.label,
          condition:         "used",
          price:             Number(price),
          stock:             1,
          warrantyMonths:    0,
          images:            [],
          active:            true,
          moderationStatus,
          pendingPrice:      price === 0,   // flag para precificação pendente
          createdAt:         admin.firestore.FieldValue.serverTimestamp(),
          updatedAt:         admin.firestore.FieldValue.serverTimestamp(),
        });

        results.created++;
        batchCount++;

        // Firestore batch limit é 500 operações
        if (batchCount >= 490) {
          await batch.commit();
          batchCount = 0;
        }
      } catch (err) {
        results.errors.push(`${part.name}: ${err.message}`);
      }
    }
  }

  if (batchCount > 0) await batch.commit();
  return results;
}
