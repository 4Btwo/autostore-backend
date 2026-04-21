/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Confidence Score System                                         ║
 * ║                                                                  ║
 * ║  Scores range from 0.0 → 1.0                                     ║
 * ║                                                                  ║
 * ║  Scoring breakdown:                                              ║
 * ║    0.50  Base: masterPart exists in catalog (any source)         ║
 * ║    +0.20  Source is "tecdoc" (structured, verified dataset)      ║
 * ║    +0.20  Seller explicitly confirmed compatibility               ║
 * ║    +0.05  masterPart has vehicle compatibility entries            ║
 * ║    +0.05  Seller is verified (sellerVerified = true)             ║
 * ║  ─────────────────────────────────────────────────────────────  ║
 * ║    Max:  1.00                                                    ║
 * ║                                                                  ║
 * ║  Future extensions (not yet wired):                              ║
 * ║    - +0.05 after first confirmed delivery (no return)            ║
 * ║    - +0.05 after 5+ positive reviews on this listing             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/**
 * @typedef {object} ScoreInput
 * @property {"tecdoc"|"internal"} source - Origin of the masterPart
 * @property {boolean} sellerConfirmedCompatibility - Seller acknowledged compatibility
 * @property {Array}   compatibility - masterPart compatibility array
 * @property {boolean} [sellerVerified] - Whether the seller account is verified
 */

/**
 * Calculate the confidence score for a marketplace listing.
 *
 * @param {ScoreInput} input
 * @returns {{ score: number, breakdown: object }}
 */
export function calculateConfidenceScore({
  source,
  sellerConfirmedCompatibility,
  compatibility = [],
  sellerVerified = false,
}) {
  const breakdown = {
    base:                    0.50,
    tecdocSource:            0,
    sellerConfirmed:         0,
    hasCompatibilityData:    0,
    sellerVerifiedBonus:     0,
  };

  // +0.20 if from TecDoc (structured, authoritative dataset)
  if (source === "tecdoc") {
    breakdown.tecdocSource = 0.20;
  }

  // +0.20 if seller explicitly confirmed compatibility
  if (sellerConfirmedCompatibility === true) {
    breakdown.sellerConfirmed = 0.20;
  }

  // +0.05 if masterPart has at least one compatibility entry
  if (Array.isArray(compatibility) && compatibility.length > 0) {
    breakdown.hasCompatibilityData = 0.05;
  }

  // +0.05 if seller is platform-verified
  if (sellerVerified === true) {
    breakdown.sellerVerifiedBonus = 0.05;
  }

  const score = Math.min(
    1.0,
    Object.values(breakdown).reduce((sum, v) => sum + v, 0)
  );

  return {
    score: Math.round(score * 100) / 100, // 2 decimal places
    breakdown,
  };
}

/**
 * Returns a human-readable confidence label.
 * @param {number} score
 * @returns {"very_low"|"low"|"medium"|"high"|"very_high"}
 */
export function confidenceLabel(score) {
  if (score >= 0.90) return "very_high";
  if (score >= 0.75) return "high";
  if (score >= 0.60) return "medium";
  if (score >= 0.40) return "low";
  return "very_low";
}
