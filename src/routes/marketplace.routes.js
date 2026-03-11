import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../config/firebase.js";
import { createMarketplacePart } from "../controllers/marketplace.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

const uploadPath = path.resolve("uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_")),
});
const upload = multer({ storage });

// GET — listar todas as peças do marketplace
router.get("/", async (req, res, next) => {
  try {
    const { sellerId, condition, limit = 20 } = req.query;
    let query = db.collection("marketplaceParts").where("active", "==", true);
    if (sellerId) query = query.where("sellerId", "==", sellerId);
    if (condition) query = query.where("condition", "==", condition);
    query = query.orderBy("createdAt", "desc").limit(Number(limit));
    const snap = await query.get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// GET /:id — peça com dados completos (masterPart + seller)
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await db.collection("marketplaceParts").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: "Peça não encontrada" });

    const data = { id: doc.id, ...doc.data() };

    if (data.masterPartId) {
      const masterDoc = await db.collection("masterParts").doc(data.masterPartId).get();
      if (masterDoc.exists) {
        const master = masterDoc.data();
        data.part = { ...master };
        if (master.brandId) {
          const brandDoc = await db.collection("brands").doc(master.brandId).get();
          if (brandDoc.exists) data.part.brandName = brandDoc.data().name;
        }
        if (master.categoryId) {
          const catDoc = await db.collection("categories").doc(master.categoryId).get();
          if (catDoc.exists) data.part.categoryName = catDoc.data().name;
        }
      }
    }

    if (data.sellerId) {
      const sellerDoc = await db.collection("users").doc(data.sellerId).get();
      if (sellerDoc.exists) {
        const s = sellerDoc.data();
        data.seller = { name: s.name, sellerVerified: s.sellerVerified };
      }
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST — criar anúncio (vendedor autenticado)
router.post("/", authenticate, upload.array("images", 4), createMarketplacePart);

export default router;
