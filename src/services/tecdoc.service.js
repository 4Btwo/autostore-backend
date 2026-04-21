/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  LAYER 1 — TecDoc Offline Dataset (Read-Only)                   ║
 * ║                                                                  ║
 * ║  Simulates access to the TecDoc Brazil offline dataset.          ║
 * ║  This layer is STRICTLY read-only and isolated.                  ║
 * ║  Data here NEVER goes directly to Firestore — it must pass       ║
 * ║  through the Normalization Layer (masterParts.service.js) first. ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * In production, replace the stub dataset below with a real
 * connection to your TecDoc SQLite/MySQL/API endpoint.
 *
 * Contract:
 *   - searchByName(query)  → TecDocRawPart[]
 *   - searchByOem(oem)     → TecDocRawPart | null
 *   - getCompatibility(id) → TecDocCompatibility[]
 */

// ─── In-memory stub (replace with real DB driver in production) ──────────────
const TECDOC_STUB = [
  {
    tecdocId: "TD-001",
    articleNumber: "1987432031",
    genericArticleId: 1289,
    brandName: "BOSCH",
    genericArticleDescription: "Filtro de Óleo",
    oemNumbers: ["06A115561B", "06A115561"],
    vehicleApplications: [
      { makeId: 16, makeName: "VOLKSWAGEN", modelId: 285, modelName: "Golf IV", year: "1998-2004", engineCode: "AZJ" },
      { makeId: 16, makeName: "VOLKSWAGEN", modelId: 317, modelName: "Polo", year: "2002-2010", engineCode: "BKY" },
    ],
    categoryCode: "FLT_OIL",
    categoryName: "Filtros de Óleo",
    specifications: { thread: "M 20 x 1.5", height_mm: 78, outer_diameter_mm: 65 },
  },
  {
    tecdocId: "TD-002",
    articleNumber: "0451103373",
    genericArticleId: 1289,
    brandName: "BOSCH",
    genericArticleDescription: "Filtro de Óleo",
    oemNumbers: ["11427512300"],
    vehicleApplications: [
      { makeId: 10, makeName: "BMW", modelId: 45, modelName: "Série 3 (E46)", year: "1998-2005", engineCode: "M43B19" },
    ],
    categoryCode: "FLT_OIL",
    categoryName: "Filtros de Óleo",
    specifications: { thread: "M 20 x 1.5", height_mm: 93, outer_diameter_mm: 76 },
  },
  {
    tecdocId: "TD-003",
    articleNumber: "F026402062",
    genericArticleId: 1421,
    brandName: "BOSCH",
    genericArticleDescription: "Filtro de Combustível",
    oemNumbers: ["7700845961"],
    vehicleApplications: [
      { makeId: 50, makeName: "RENAULT", modelId: 198, modelName: "Scenic", year: "1999-2003", engineCode: "F9Q" },
    ],
    categoryCode: "FLT_FUEL",
    categoryName: "Filtros de Combustível",
    specifications: { connection_diameter_mm: 8 },
  },
  {
    tecdocId: "TD-004",
    articleNumber: "IC-TECDOC-STUB",
    genericArticleId: 9999,
    brandName: "MAHLE",
    genericArticleDescription: "Pastilha de Freio",
    oemNumbers: ["GDB1556"],
    vehicleApplications: [
      { makeId: 16, makeName: "VOLKSWAGEN", modelId: 285, modelName: "Golf IV", year: "1999-2005", engineCode: "AXP" },
    ],
    categoryCode: "BRK_PAD",
    categoryName: "Freios - Pastilhas",
    specifications: { width_mm: 128, height_mm: 59, thickness_mm: 17 },
  },
];

// ─── In-memory cache to avoid repeated scans ─────────────────────────────────
const _nameCache = new Map();   // query  → TecDocRawPart[]
const _oemCache  = new Map();   // oem    → TecDocRawPart | null
const _idCache   = new Map();   // tdId   → TecDocRawPart | null

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Search TecDoc by part name / description (case-insensitive substring).
 * @param {string} query
 * @returns {TecDocRawPart[]}
 */
export function tecdocSearchByName(query) {
  const key = query.toLowerCase().trim();
  if (_nameCache.has(key)) return _nameCache.get(key);

  const results = TECDOC_STUB.filter((p) =>
    p.genericArticleDescription.toLowerCase().includes(key) ||
    p.brandName.toLowerCase().includes(key)
  );

  _nameCache.set(key, results);
  return results;
}

/**
 * Lookup a TecDoc part by OEM number (exact match).
 * @param {string} oem
 * @returns {TecDocRawPart | null}
 */
export function tecdocSearchByOem(oem) {
  const normalized = oem.replace(/\s/g, "").toUpperCase();
  if (_oemCache.has(normalized)) return _oemCache.get(normalized);

  const found = TECDOC_STUB.find((p) =>
    p.oemNumbers.some((n) => n.replace(/\s/g, "").toUpperCase() === normalized)
  ) || null;

  _oemCache.set(normalized, found);
  return found;
}

/**
 * Get TecDoc part by internal TecDoc ID.
 * @param {string} tecdocId
 * @returns {TecDocRawPart | null}
 */
export function tecdocGetById(tecdocId) {
  if (_idCache.has(tecdocId)) return _idCache.get(tecdocId);
  const found = TECDOC_STUB.find((p) => p.tecdocId === tecdocId) || null;
  _idCache.set(tecdocId, found);
  return found;
}

/**
 * Get vehicle compatibility entries for a given TecDoc part ID.
 * @param {string} tecdocId
 * @returns {{ makeId, makeName, modelId, modelName, year, engineCode }[]}
 */
export function tecdocGetCompatibility(tecdocId) {
  const part = tecdocGetById(tecdocId);
  return part ? part.vehicleApplications : [];
}
