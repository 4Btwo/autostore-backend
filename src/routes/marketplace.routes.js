import express from "express";
import multer from "multer";
import { db, admin } from "../config/firebase.js";
import {
  createMarketplacePart,
  updatePartImages,
} from "../controllers/marketplace.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate, createMarketplacePartSchema } from "../middlewares/validate.js";
import { apiLimiter, publicLimiter } from "../middlewares/rateLimiter.js";
import {
  findOrImportMasterPartsByName,
  findOrCreateMasterPartByOem,
} from "../services/masterParts.service.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Apenas imagens são permitidas"));
  },
});

// ─── Helper: enrich items with masterPart + category + seller data ────────────
async function enrichItems(items) {
  if (!items.length) return [];

  const masterIds = [...new Set(items.map((i) => i.masterPartId).filter(Boolean))];
  const masterDocs = await Promise.all(
    masterIds.map((id) => db.collection("masterParts").doc(id).get())
  );
  const masterMap = {};
  for (const doc of masterDocs) {
    if (doc.exists) masterMap[doc.id] = { id: doc.id, ...doc.data() };
  }

  const catIds = [
    ...new Set(
      Object.values(masterMap).map((m) => m.categoryId).filter(Boolean)
    ),
  ];
  const catDocs = await Promise.all(
    catIds.map((id) => db.collection("categories").doc(id).get())
  );
  const catMap = {};
  for (const doc of catDocs) {
    if (doc.exists) catMap[doc.id] = doc.data().name;
  }

  const sellerIds = [...new Set(items.map((i) => i.sellerId).filter(Boolean))];
  const sellerDocs = await Promise.all(
    sellerIds.map((id) => db.collection("users").doc(id).get())
  );
  const sellerMap = {};
  for (const doc of sellerDocs) {
    if (doc.exists) {
      const s = doc.data();
      sellerMap[doc.id] = {
        uid:            doc.id,
        name:           s.name || s.displayName || "Loja",
        photo:          s.photo || s.photoURL || null,
        plan:           s.plan === "premium" || s.isPremium === true ? "premium" : "free",
        specialty:      s.specialty || "Peças Automotivas",
        sellerVerified: s.sellerVerified || false,
        ratingAvg:      s.ratingAvg || 0,
        ratingCount:    s.ratingCount || 0,
        coords:         s.coords || null,
      };
    }
  }

  return items.map((item) => {
    const master = masterMap[item.masterPartId];
    const seller = sellerMap[item.sellerId];
    return {
      ...item,
      ...(master
        ? { part: { ...master, categoryName: catMap[master.categoryId] || null } }
        : {}),
      ...(seller ? { seller } : {}),
    };
  });
}

// ─── GET /catalog/search — Step 1 for sellers ─────────────────────────────────
// Sellers MUST use this endpoint to find/import a masterPart before listing.
//
// Query params:
//   q=<name>           → search by name (TecDoc fallback if not in masterParts)
//   oem=<oemNumber>    → search by OEM (imports from TecDoc if needed)
//
router.get("/catalog/search", authenticate, apiLimiter, async (req, res, next) => {
  try {
    const { q, oem } = req.query;

    if (oem) {
      // OEM search: find-or-create masterPart from TecDoc
      const { masterPart, wasCreated } = await findOrCreateMasterPartByOem(oem);
      return res.json({
        success: true,
        source: wasCreated ? "tecdoc_imported" : "masterParts",
        data: [masterPart],
      });
    }

    if (q) {
      const { results, source } = await findOrImportMasterPartsByName(q);
      return res.json({ success: true, source, data: results });
    }

    return res.status(400).json({
      success: false,
      message: 'Informe "q" (nome) ou "oem" (número OEM) para buscar peças do catálogo.',
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET / — public marketplace listing ──────────────────────────────────────
router.get("/", publicLimiter, async (req, res, next) => {
  try {
    const { sellerId, condition, limit = 20, lastDocId } = req.query;

    let query = db.collection("marketplaceParts").where("active", "==", true);

    if (sellerId) {
      query = query.where("sellerId", "==", sellerId);
    } else {
      query = query.where("moderationStatus", "in", ["approved", "pending"]);
    }

    if (condition) query = query.where("condition", "==", condition);
    query = query.orderBy("createdAt", "desc").limit(Number(limit));

    if (lastDocId) {
      const lastDoc = await db.collection("marketplaceParts").doc(lastDocId).get();
      if (lastDoc.exists) query = query.startAfter(lastDoc);
    }

    const snap = await query.get();
    const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const data = await enrichItems(items);

    const lastVisible = snap.docs[snap.docs.length - 1];
    res.json({
      success: true,
      data,
      pagination: {
        hasMore:   snap.docs.length === Number(limit),
        lastDocId: lastVisible ? lastVisible.id : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /:id ─────────────────────────────────────────────────────────────────
router.get("/:id", publicLimiter, async (req, res, next) => {
  try {
    const doc = await db.collection("marketplaceParts").doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({ success: false, message: "Peça não encontrada" });

    const data = { id: doc.id, ...doc.data() };

    if (data.masterPartId) {
      const masterDoc = await db.collection("masterParts").doc(data.masterPartId).get();
      if (masterDoc.exists) {
        const master = masterDoc.data();
        data.part = { ...master };
        const [brandDoc, catDoc] = await Promise.all([
          master.brandId
            ? db.collection("brands").doc(master.brandId).get()
            : Promise.resolve(null),
          master.categoryId
            ? db.collection("categories").doc(master.categoryId).get()
            : Promise.resolve(null),
        ]);
        if (brandDoc?.exists) data.part.brandName = brandDoc.data().name;
        if (catDoc?.exists)   data.part.categoryName = catDoc.data().name;
      }
    }

    if (data.sellerId) {
      const sellerDoc = await db.collection("users").doc(data.sellerId).get();
      if (sellerDoc.exists) {
        const s = sellerDoc.data();
        data.seller = {
          name:           s.name,
          sellerVerified: s.sellerVerified,
          photo:          s.photo || null,
          ratingAvg:      s.ratingAvg || null,
          ratingCount:    s.ratingCount || 0,
        };
      }
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── POST / — create listing (catalog-controlled) ────────────────────────────
// Sellers MUST provide masterPartId from the catalog search above.
router.post(
  "/",
  authenticate,
  apiLimiter,
  upload.array("images", 4),
  validate(createMarketplacePartSchema),
  createMarketplacePart
);

// ─── PATCH /:id — update price / stock / active / sellerNotes ─────────────────
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const { patchMarketplacePart } = await import("../services/marketplace.service.js");
    const result = await patchMarketplacePart(
      req.params.id,
      req.user.uid,
      req.body,
      req.user.isAdmin || false
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /:id/images ────────────────────────────────────────────────────────
router.patch(
  "/:id/images",
  authenticate,
  upload.array("images", 4),
  updatePartImages
);

export default router;
