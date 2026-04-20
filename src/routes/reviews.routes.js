import express from "express";
import { db, admin } from "../config/firebase.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate, createReviewSchema } from "../middlewares/validate.js";
import AppError from "../errors/AppError.js";

const router = express.Router();

// POST /reviews
router.post("/", authenticate, validate(createReviewSchema), async (req, res, next) => {
  try {
    const buyerId = req.user.uid;
    const { sellerId, orderId, rating, comment } = req.body;

    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists || orderDoc.data().buyerId !== buyerId) {
      throw new AppError("Pedido não encontrado ou não pertence a você", 403, "FORBIDDEN");
    }

    if (orderDoc.data().status !== "delivered") {
      throw new AppError("Só é possível avaliar pedidos entregues", 400, "ORDER_NOT_DELIVERED");
    }

    // Garante que o vendedor avaliado realmente participou do pedido
    const orderData = orderDoc.data();
    const sellerInOrder =
      orderData.sellerIds?.includes(sellerId) ||
      orderData.items?.some((i) => i.sellerId === sellerId);
    if (!sellerInOrder) {
      throw new AppError("Vendedor não faz parte deste pedido", 400, "SELLER_NOT_IN_ORDER");
    }

    const existing = await db
      .collection("reviews")
      .where("orderId", "==", orderId)
      .where("buyerId", "==", buyerId)
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new AppError("Você já avaliou este pedido", 400, "ALREADY_REVIEWED");
    }

    const reviewRef = await db.collection("reviews").add({
      buyerId,
      sellerId,
      orderId,
      rating: Number(rating),
      comment: comment || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Atualiza média do vendedor atomicamente via transação
    // Evita race condition quando duas avaliações chegam ao mesmo tempo
    await db.runTransaction(async (tx) => {
      const sellerRef = db.collection("users").doc(sellerId);
      const sellerDoc = await tx.get(sellerRef);
      if (!sellerDoc.exists) return;

      const data = sellerDoc.data();
      const prevCount = data.ratingCount || 0;
      const prevAvg = data.ratingAvg || 0;
      const newCount = prevCount + 1;
      // Média incremental: evita re-ler todas as avaliações
      const newAvg = (prevAvg * prevCount + Number(rating)) / newCount;

      tx.update(sellerRef, {
        ratingAvg: Math.round(newAvg * 10) / 10,
        ratingCount: newCount,
      });
    });

    await db.collection("orders").doc(orderId).update({ reviewed: true });

    res.status(201).json({ success: true, data: { id: reviewRef.id } });
  } catch (error) {
    next(error);
  }
});

// GET /reviews/seller/:sellerId — N+1 corrigido
router.get("/seller/:sellerId", async (req, res, next) => {
  try {
    const snap = await db
      .collection("reviews")
      .where("sellerId", "==", req.params.sellerId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    if (snap.empty) return res.json({ success: true, data: [] });

    // Busca todos os compradores de uma vez
    const buyerIds = [...new Set(snap.docs.map((d) => d.data().buyerId))];
    const buyerDocs = await Promise.all(
      buyerIds.map((id) => db.collection("users").doc(id).get())
    );
    const buyerMap = {};
    buyerDocs.forEach((doc) => {
      if (doc.exists) buyerMap[doc.id] = doc.data();
    });

    const reviews = snap.docs.map((doc) => {
      const d = doc.data();
      const buyer = buyerMap[d.buyerId];
      return {
        id: doc.id,
        rating: d.rating,
        comment: d.comment,
        createdAt: d.createdAt?.toDate?.() ?? null,
        buyerName: buyer?.name?.split(" ")[0] || "Usuário",
        buyerPhoto: buyer?.photo || null,
      };
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

export default router;
