/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  LAYER 2 — Normalization Layer                                   ║
 * ║                                                                  ║
 * ║  Maps TecDoc raw data → internal masterParts format.             ║
 * ║  Also manages masterParts CRUD and the search-or-create flow.    ║
 * ║                                                                  ║
 * ║  DATA FLOW (enforced here):                                      ║
 * ║    1. Caller searches masterParts                                ║
 * ║    2. If not found → query TecDoc → normalize → save             ║
 * ║    3. Return masterPart (always in internal format)              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { db, admin } from "../config/firebase.js";
import {
  tecdocSearchByName,
  tecdocSearchByOem,
  tecdocGetCompatibility,
} from "./tecdoc.service.js";
import AppError from "../errors/AppError.js";

const MASTER_PARTS_COL = "masterParts";

// ─── In-memory cache: masterPartId → masterPart data ─────────────────────────
const _masterCache = new Map();

// ─── Normalizer ──────────────────────────────────────────────────────────────

/**
 * Converts a raw TecDoc record into the internal masterParts schema.
 * This is the ONLY place where TecDoc data is transformed.
 *
 * @param {object} raw - TecDocRawPart
 * @returns {object} Normalized masterPart (NOT yet saved)
 */
function normalizeTecDocPart(raw) {
  const compatibility = tecdocGetCompatibility(raw.tecdocId).map((v) => ({
    makeId:      v.makeId,
    makeName:    v.makeName,
    modelId:     v.modelId,
    modelName:   v.modelName,
    yearRange:   v.year,
    engineCode:  v.engineCode || null,
  }));

  return {
    // --- Identity ---
    name:        `${raw.brandName} ${raw.genericArticleDescription}`.trim(),
    brand:       raw.brandName,
    category:    raw.categoryName,
    categoryCode: raw.categoryCode || null,

    // --- OEM / Article references ---
    oemNumbers:      raw.oemNumbers || [],
    articleNumber:   raw.articleNumber,
    tecdocId:        raw.tecdocId,
    genericArticleId: raw.genericArticleId || null,

    // --- Compatibility (structured, not free-form) ---
    compatibility,

    // --- Specifications (pass-through, validated by TecDoc) ---
    specifications: raw.specifications || {},

    // --- Metadata ---
    source:     "tecdoc",
    normalized: true,
    active:     true,
    createdAt:  admin.firestore.FieldValue.serverTimestamp(),
  };
}

// ─── masterParts — Search ─────────────────────────────────────────────────────

/**
 * Search existing masterParts by name or OEM.
 * @param {string} query
 * @returns {{ id, ...data }[]}
 */
export async function searchMasterParts(query) {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim().toLowerCase();
  const snap = await db
    .collection(MASTER_PARTS_COL)
    .where("active", "==", true)
    .orderBy("name")
    .startAt(q)
    .endAt(q + "\uf8ff")
    .limit(20)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Get a single masterPart by Firestore ID (with cache).
 * @param {string} masterPartId
 * @returns {{ id, ...data } | null}
 */
export async function getMasterPartById(masterPartId) {
  if (_masterCache.has(masterPartId)) return _masterCache.get(masterPartId);

  const doc = await db.collection(MASTER_PARTS_COL).doc(masterPartId).get();
  if (!doc.exists) return null;

  const result = { id: doc.id, ...doc.data() };
  _masterCache.set(masterPartId, result);
  return result;
}

// ─── Core Flow: Find-or-Create ────────────────────────────────────────────────

/**
 * THE MANDATORY FLOW:
 *   1. Search masterParts by OEM number
 *   2. If not found → search TecDoc → normalize → save to masterParts
 *   3. Return { masterPart, wasCreated }
 *
 * This is the ONLY approved entry point for creating a new marketplace listing.
 *
 * @param {string} oemNumber
 * @returns {{ masterPart: object, wasCreated: boolean }}
 */
export async function findOrCreateMasterPartByOem(oemNumber) {
  const normalized = oemNumber.replace(/\s/g, "").toUpperCase();

  // 1. Check existing masterParts
  const existing = await db
    .collection(MASTER_PARTS_COL)
    .where("oemNumbers", "array-contains", normalized)
    .limit(1)
    .get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    const masterPart = { id: doc.id, ...doc.data() };
    _masterCache.set(doc.id, masterPart);
    return { masterPart, wasCreated: false };
  }

  // 2. Query TecDoc (offline dataset)
  const raw = tecdocSearchByOem(normalized);
  if (!raw) {
    throw new AppError(
      `Peça com OEM "${oemNumber}" não encontrada no catálogo TecDoc. ` +
      `Verifique o número OEM ou solicite cadastro manual ao administrador.`,
      404,
      "MASTER_PART_NOT_FOUND"
    );
  }

  // 3. Normalize TecDoc → internal format
  const normalized_data = normalizeTecDocPart(raw);

  // 4. Save to masterParts
  const ref = await db.collection(MASTER_PARTS_COL).add(normalized_data);
  const masterPart = { id: ref.id, ...normalized_data };
  _masterCache.set(ref.id, masterPart);

  console.info(`[masterParts] Created new masterPart "${masterPart.name}" from TecDoc (${raw.tecdocId})`);
  return { masterPart, wasCreated: true };
}

/**
 * Same as findOrCreateMasterPartByOem but accepts a search query (name/brand).
 * Returns up to 10 results. Creates only if exactly 1 TecDoc result is found.
 *
 * @param {string} query
 * @returns {{ results: object[], source: "masterParts" | "tecdoc" }}
 */
export async function findOrImportMasterPartsByName(query) {
  // 1. Search existing masterParts
  const existing = await searchMasterParts(query);
  if (existing.length > 0) {
    return { results: existing, source: "masterParts" };
  }

  // 2. Search TecDoc offline dataset
  const rawResults = tecdocSearchByName(query);
  if (!rawResults.length) {
    return { results: [], source: "tecdoc" };
  }

  // 3. Normalize all results (do NOT auto-save multi-results — require OEM confirmation)
  const previews = rawResults.map((raw) => ({
    ...normalizeTecDocPart(raw),
    _tecdocId: raw.tecdocId,      // ephemeral: used for import confirmation
    _notSavedYet: true,
  }));

  return { results: previews, source: "tecdoc" };
}

/**
 * Validates that a masterPartId exists. Throws if not found.
 * Used by the marketplace creation flow as a gate check.
 *
 * @param {string} masterPartId
 * @returns {object} The masterPart document
 */
export async function requireMasterPart(masterPartId) {
  if (!masterPartId) {
    throw new AppError("masterPartId é obrigatório", 400, "MISSING_MASTER_PART_ID");
  }

  const masterPart = await getMasterPartById(masterPartId);
  if (!masterPart) {
    throw new AppError(
      `masterPart "${masterPartId}" não encontrado. ` +
      `Use o endpoint de busca de peças para localizar ou importar do TecDoc primeiro.`,
      404,
      "MASTER_PART_NOT_FOUND"
    );
  }

  return masterPart;
}

/**
 * Invalidates the in-memory cache for a specific masterPartId.
 * Call this after manual admin updates.
 */
export function invalidateMasterPartCache(masterPartId) {
  _masterCache.delete(masterPartId);
}
