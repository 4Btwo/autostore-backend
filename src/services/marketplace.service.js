/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Marketplace Service — Layer 4 (Listings)                        ║
 * ║                                                                  ║
 * ║  Enforces the controlled catalog flow:                           ║
 * ║    Sellers CANNOT create listings from scratch.                  ║
 * ║    They MUST reference an existing masterPart.                   ║
 * ║                                                                  ║
 * ║  Mandatory fields on every listing:                              ║
 * ║    - masterPartId (validated against masterParts collection)     ║
 * ║    - sellerConfirmedCompatibility === true                       ║
 * ║    - price > 0, stock >= 0                                       ║
 * ║    - condition in ["new", "used"]                                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { db, admin } from "../config/firebase.js";
import AppError from "../errors/AppError.js";
import { requireMasterPart } from "./masterParts.service.js";
import {
  calculateConfidenceScore,
  confidenceLabel,
} from "./confidenceScore.service.js";

// Fields the seller can update (all others are immutable after creation)
const SELLER_UPDATABLE_FIELDS = new Set([
  "price",
  "stock",
  "sellerNotes",
  "images",
  "active",
]);

// ─── Create Listing ──────────────────────────────────────────────────────────

export async function createMarketplacePartService(data) {
  const {
    sellerId,
    masterPartId,
    price,
    stock,
    condition,
    state,
    sellerNotes,
    images,
    sellerConfirmedCompatibility,
  } = data;

  // Gate 1: sellerConfirmedCompatibility must be explicitly true
  if (sellerConfirmedCompatibility !== true) {
    throw new AppError(
      "Confirme a compatibilidade da peça antes de criar o anúncio (sellerConfirmedCompatibility: true).",
      400,
      "COMPATIBILITY_NOT_CONFIRMED"
    );
  }

  // Gate 2: masterPartId must exist in the catalog
  const masterPart = await requireMasterPart(masterPartId);

  // Gate 3: Check for duplicate listing (same seller + masterPart)
  const existing = await db
    .collection("marketplaceParts")
    .where("sellerId", "==", sellerId)
    .where("masterPartId", "==", masterPartId)
    .limit(1)
    .get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    const currentStock = doc.data().stock || 0;
    await db.collection("marketplaceParts").doc(doc.id).update({
      stock:       currentStock + Number(stock),
      price:       Number(price),
      condition,
      sellerNotes: sellerNotes || doc.data().sellerNotes || "",
      images:      images?.length ? images : doc.data().images || [],
      updatedAt:   admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      message:           "Estoque atualizado com sucesso",
      marketplacePartId: doc.id,
      moderationStatus:  doc.data().moderationStatus,
      confidenceScore:   doc.data().confidenceScore,
    };
  }

  // Gate 4: Seller data for moderation + confidence
  const sellerDoc = await db.collection("users").doc(sellerId).get();
  const sellerData = sellerDoc.exists ? sellerDoc.data() : {};
  const isVerifiedSeller =
    sellerData.isPremium === true || sellerData.sellerVerified === true;

  // Confidence Score
  const { score, breakdown } = calculateConfidenceScore({
    source:                     masterPart.source,
    sellerConfirmedCompatibility,
    compatibility:              masterPart.compatibility || [],
    sellerVerified:             isVerifiedSeller,
  });

  const moderationStatus = isVerifiedSeller ? "approved" : "pending";

  const listing = {
    sellerId,
    masterPartId,
    price:    Number(price),
    stock:    Number(stock),
    condition,
    state:    state || "",
    sellerNotes:                 sellerNotes || "",
    images:                      images || [],
    sellerConfirmedCompatibility: true,
    confidenceScore:             score,
    confidenceLabel:             confidenceLabel(score),
    confidenceBreakdown:         breakdown,
    source:                      masterPart.source,
    active:                      true,
    moderationStatus,
    approvedAt:      isVerifiedSeller ? new Date().toISOString() : null,
    rejectedAt:      null,
    rejectionReason: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection("marketplaceParts").add(listing);

  if (!isVerifiedSeller) {
    await db
      .collection("notifications")
      .add({
        userId:  sellerId,
        type:    "listing_pending",
        title:   "Anúncio em análise",
        message: `Seu anúncio de "${masterPart.name}" foi enviado para moderação.`,
        partId:  ref.id,
        read:    false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch(() => {});
  }

  return {
    message: isVerifiedSeller
      ? "Anúncio publicado com sucesso!"
      : "Anúncio criado. Aguardando aprovação da moderação.",
    marketplacePartId: ref.id,
    moderationStatus,
    confidenceScore:   score,
    confidenceLabel:   confidenceLabel(score),
  };
}

// ─── Update Images ────────────────────────────────────────────────────────────

export async function updateMarketplacePartImages(marketplacePartId, sellerId, newImages) {
  const ref = db.collection("marketplaceParts").doc(marketplacePartId);
  const doc = await ref.get();

  if (!doc.exists) throw new AppError("Peça não encontrada", 404, "NOT_FOUND");
  if (doc.data().sellerId !== sellerId)
    throw new AppError("Sem permissão", 403, "FORBIDDEN");

  const merged = [...(doc.data().images || []), ...newImages].slice(0, 4);

  const masterRef = db.collection("masterParts").doc(doc.data().masterPartId);
  const masterDoc = await masterRef.get();
  if (masterDoc.exists && (!masterDoc.data().images || !masterDoc.data().images.length)) {
    await masterRef.update({ images: merged });
  }

  await ref.update({ images: merged, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return { marketplacePartId, images: merged };
}

// ─── Patch listing ────────────────────────────────────────────────────────────

export async function patchMarketplacePart(id, sellerId, updates, isAdmin = false) {
  const ref = db.collection("marketplaceParts").doc(id);
  const doc = await ref.get();

  if (!doc.exists) throw new AppError("Anúncio não encontrado", 404, "NOT_FOUND");
  if (!isAdmin && doc.data().sellerId !== sellerId)
    throw new AppError("Sem permissão", 403, "FORBIDDEN");

  // Block immutable fields
  const IMMUTABLE = ["masterPartId", "source", "confidenceScore", "sellerId", "createdAt"];
  for (const field of IMMUTABLE) {
    if (field in updates) {
      throw new AppError(`Campo "${field}" é imutável após criação.`, 400, "IMMUTABLE_FIELD");
    }
  }

  if (!isAdmin) {
    for (const key of Object.keys(updates)) {
      if (!SELLER_UPDATABLE_FIELDS.has(key)) {
        throw new AppError(`Campo não permitido: ${key}`, 400, "INVALID_FIELD");
      }
    }
  }

  const safe = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  if (typeof updates.price !== "undefined") {
    const p = Number(updates.price);
    if (isNaN(p) || p <= 0) throw new AppError("Preço inválido", 400, "INVALID_PRICE");
    safe.price = p;
  }
  if (typeof updates.stock !== "undefined") {
    const s = Number(updates.stock);
    if (isNaN(s) || s < 0) throw new AppError("Estoque inválido", 400, "INVALID_STOCK");
    safe.stock = s;
  }
  if (typeof updates.active !== "undefined")       safe.active = Boolean(updates.active);
  if (typeof updates.sellerNotes !== "undefined")  safe.sellerNotes = String(updates.sellerNotes).slice(0, 500);
  if (isAdmin && updates.moderationStatus)         safe.moderationStatus = updates.moderationStatus;

  await ref.update(safe);
  return { id, ...safe };
}
