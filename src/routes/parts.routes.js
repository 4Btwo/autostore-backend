import express from "express";
import { db } from "../config/firebase.js";
import { publicLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", publicLimiter, async (req, res, next) => {
  try {
    const { categoryId, vehicleId, oem, q } = req.query;
    const term = (oem || q || "").toLowerCase().trim();

    if (term) {
      // Busca por OEM exato primeiro (usa índice)
      const exactSnap = await db.collection("masterParts")
        .where("oemNumber", "==", term.toUpperCase())
        .where("active", "==", true)
        .limit(10)
        .get();

      if (!exactSnap.empty) {
        const results = exactSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, data: results });
      }

      // Busca por intervalo de prefixo (usa índice de oemNumber e name)
      // Firestore não tem full-text, mas startAt/endAt cobre prefixo eficientemente
      const end = term.slice(0, -1) + String.fromCharCode(term.charCodeAt(term.length - 1) + 1);

      const [oemSnap, nameSnap] = await Promise.all([
        db.collection("masterParts")
          .where("active",    "==",        true)
          .where("oemNumber", ">=",        term.toUpperCase())
          .where("oemNumber", "<",         end.toUpperCase())
          .limit(20)
          .get(),
        db.collection("masterParts")
          .where("active", "==",  true)
          .where("name",   ">=",  term)
          .where("name",   "<",   end)
          .limit(20)
          .get(),
      ]);

      const seen = new Set();
      const results = [];
      for (const snap of [oemSnap, nameSnap]) {
        snap.docs.forEach(doc => {
          if (!seen.has(doc.id)) {
            seen.add(doc.id);
            results.push({ id: doc.id, ...doc.data() });
          }
        });
      }

      return res.json({ success: true, data: results });
    }

    // Listagem por categoria (sem termo de busca)
    let query = db.collection("masterParts").where("active", "==", true);
    if (categoryId) query = query.where("categoryId", "==", categoryId);
    const snap = await query.orderBy("name").limit(100).get();
    const parts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: parts });
  } catch (error) {
    next(error);
  }
});

export default router;
