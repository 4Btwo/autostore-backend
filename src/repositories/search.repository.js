import {db} from "../config/firebase.js";

export async function findBrandBySlug(slug) {
  const snapshot = await db
    .collection("brands")
    .where("slug", "==", slug)
    .where("active", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function findModelBySlug(slug, brandId) {
  const snapshot = await db
    .collection("models")
    .where("slug", "==", slug)
    .where("brandId", "==", brandId)
    .where("active", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/* 🔥 CORRIGIDO AQUI */
export async function findTechnical(
  brandId,
  modelId,
  engineDisplacement,
  fuelType
) {
  const snapshot = await db
    .collection("vehicleTechnicals") // ✅ coleção correta
    .where("brandId", "==", brandId)
    .where("modelId", "==", modelId)
    .where("engineDisplacement", "==", engineDisplacement)
    .where("fuelType", "==", fuelType)
    .where("active", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/* 🔥 CORRIGIDO AQUI */
export async function findCompatibilities(technicalId) {
  const snapshot = await db
    .collection("technicalCompatibilities") // ✅ coleção correta
    .where("vehicleTechnicalId", "==", technicalId) // ✅ campo correto
    .where("active", "==", true)
    .get();

  return snapshot.docs.map((doc) => doc.data().masterPartId);
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

  let query = db
    .collection("marketplaceParts")
    .where("masterPartId", "in", masterPartIds.slice(0, 10))
    .where("active", "==", true);

  if (minStock) {
    query = query.where("stock", ">=", minStock);
  }

  if (condition) {
    query = query.where("condition", "==", condition);
  }

  if (minWarranty) {
    query = query.where("warrantyMonths", ">=", minWarranty);
  }

  query = query.orderBy(orderBy || "createdAt", orderDirection || "desc");

  if (lastDocId) {
    const lastDoc = await db
      .collection("marketplaceParts")
      .doc(lastDocId)
      .get();

    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  query = query.limit(limit || 10);

  const snapshot = await query.get();

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

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

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function findBrandsByIds(ids) {
  if (!ids.length) return [];

  const snapshot = await db
    .collection("brands")
    .where("__name__", "in", ids.slice(0, 10))
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function findCategoriesByIds(ids) {
  if (!ids.length) return [];

  const snapshot = await db
    .collection("categories")
    .where("__name__", "in", ids.slice(0, 10))
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}