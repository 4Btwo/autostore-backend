import express from "express";
import { db, admin } from "../config/firebase.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /reviews — criar avaliação
router.post("/", authenticate, async (req, res, next) => {
  try {
    const buyerId = req.user.uid;
    const { sellerId, orderId, rating, comment } = req.body;

    if (!sellerId || !orderId || !rating) {
      return res.status(400).json({ success: false, message: "sellerId, orderId e rating são obrigatórios" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating deve ser entre 1 e 5" });
    }

    // Verifica se pedido existe e pertence ao comprador
    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists || orderDoc.data().buyerId !== buyerId) {
      return res.status(403).json({ success: false, message: "Pedido não encontrado" });
    }

    // Verifica se já avaliou esse pedido
    const existing = await db.collection("reviews")
      .where("orderId", "==", orderId)
      .where("buyerId", "==", buyerId)
      .limit(1).get();
    if (!existing.empty) {
      return res.status(400).json({ success: false, message: "Você já avaliou este pedido" });
    }

    // Salva avaliação
    const reviewRef = await db.collection("reviews").add({
      buyerId,
      sellerId,
      orderId,
      rating: Number(rating),
      comment: comment || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Atualiza média do vendedor
    const reviewsSnap = await db.collection("reviews").where("sellerId", "==", sellerId).get();
    const ratings = reviewsSnap.docs.map(d => d.data().rating);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    await db.collection("users").doc(sellerId).update({
      ratingAvg: Math.round(avg * 10) / 10,
      ratingCount: ratings.length,
    });

    // Marca pedido como avaliado
    await db.collection("orders").doc(orderId).update({ reviewed: true });

    res.status(201).json({ success: true, data: { id: reviewRef.id } });
  } catch (error) {
    next(error);
  }
});

// GET /reviews/seller/:sellerId — avaliações de um vendedor
router.get("/seller/:sellerId", async (req, res, next) => {
  try {
    const snap = await db.collection("reviews")
      .where("sellerId", "==", req.params.sellerId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const reviews = await Promise.all(snap.docs.map(async doc => {
      const d = doc.data();
      const buyerDoc = await db.collection("users").doc(d.buyerId).get();
      return {
        id: doc.id,
        rating: d.rating,
        comment: d.comment,
        createdAt: d.createdAt?.toDate?.() ?? null,
        buyerName: buyerDoc.exists ? buyerDoc.data().name?.split(" ")[0] : "Usuário",
        buyerPhoto: buyerDoc.exists ? buyerDoc.data().photo || null : null,
      };
    }));

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

export default router;
