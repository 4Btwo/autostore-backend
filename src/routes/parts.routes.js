import express from "express";
import {db} from "../config/firebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { categoryId, vehicleId, oem, q } = req.query;

    // Busca no catálogo masterParts por OEM ou nome
    if (oem || q) {
      const term = (oem || q || "").toLowerCase().trim();
      const snap = await db.collection("masterParts").where("active", "==", true).get();
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const results = all.filter(p =>
        p.oemNumber?.toLowerCase().includes(term) ||
        p.name?.toLowerCase().includes(term)
      );
      return res.json({ data: results });
    }

    // Busca legada na coleção parts
    let query = db.collection("parts").where("active", "==", true);
    if (categoryId) query = query.where("categoryId", "==", categoryId);
    if (vehicleId) query = query.where("vehicleId", "==", vehicleId);
    const snapshot = await query.get();
    const parts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar peças" });
  }
});

export default router;
