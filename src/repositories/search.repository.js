import { db } from "../config/firebase.js";

// ─── Busca compatibilidades usando a coleção flat ────────────────────────────
// Campos esperados em cada doc de `compatibilities`:
//   brandSlug, modelSlug, engineDisplacement, fuelNorm, masterPartId, active
//
// Esses campos são adicionados automaticamente pelo script migrateCompatibilities.js
// e já estarão presentes nos seeds novos (Mahle, NGK, Bosch, etc.)

export async function findCompatiblePartIds({
  brandSlug,
  modelSlug,
  engineDisplacement,
  fuelNorm,
}) {
  const snapshot = await db
    .collection("compatibilities")
    .where("brandSlug", "==", brandSlug)
    .where("modelSlug", "==", modelSlug)
    .where("engineDisplacement", "==", engineDisplacement)
    .where("fuelNorm", "==", fuelNorm)
    .where("active", "==", true)
    .get();

  if (snapshot.empty) return [];

  // Deduplica masterPartIds (uma peça pode ter múltiplos docs de compatibilidade)
  const ids = new Set();
  snapshot.docs.forEach((doc) => {
    const id = doc.data().masterPartId;
    if (id) ids.add(id);
  });

  return [...ids];
}

export async function findMarketplaceParts({
  masterPartIds,
  limit,
  lastDocId,
  orderBy,
  orderDirection,
  minStock,
  condition,
  minWarranty,
}) {
  if (!masterPartIds.length)
    return { data: [], pagination: { hasMore: false } };

  // Firestore limita "in" a 10 itens — paginamos o array se necessário
  const ids = masterPartIds.slice(0, 10);

  let query = db
    .collection("marketplaceParts")
    .where("masterPartId", "in", ids)
    .where("active", "==", true);

  if (minStock) query = query.where("stock", ">=", Number(minStock));
  if (condition) query = query.where("condition", "==", condition);
  if (minWarranty) query = query.where("warrantyMonths", ">=", Number(minWarranty));

  query = query.orderBy(orderBy || "createdAt", orderDirection || "desc");

  if (lastDocId) {
    const lastDoc = await db.collection("marketplaceParts").doc(lastDocId).get();
    if (lastDoc.exists) query = query.startAfter(lastDoc);
  }

  query = query.limit(limit || 10);

  const snapshot = await query.get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return {
    data,
    pagination: {
      hasMore: snapshot.docs.length === (limit || 10),
      lastDocId: lastVisible ? lastVisible.id : null,
    },
  };
}

export async function findMasterPartsByIds(ids) {
  if (!ids.length) return [];
  const snapshot = await db
    .collection("masterParts")
    .where("__name__", "in", ids.slice(0, 10))
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function findCategoriesByIds(ids) {
  if (!ids.length) return [];
  const snapshot = await db
    .collection("categories")
    .where("__name__", "in", ids.slice(0, 10))
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
