import express from "express";
import {db} from "../config/firebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { categoryId, vehicleId } = req.query;

    let query = db.collection("parts").where("active", "==", true);

    if (categoryId) {
      query = query.where("categoryId", "==", categoryId);
    }

    if (vehicleId) {
      query = query.where("vehicleId", "==", vehicleId);
    }

    const snapshot = await query.get();

    const parts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar peças" });
  }
});

export default router;
