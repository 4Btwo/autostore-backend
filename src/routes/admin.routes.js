// ─── src/routes/admin.routes.js ───────────────────────────────────────────────
// Rotas de administração/moderação de anúncios
//
// COMO USAR:
//   No arquivo src/routes.js (ou server.js), adicione:
//   import adminRoutes from "./routes/admin.routes.js";
//   router.use("/admin", adminRoutes);
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import { db } from "./config/firebase.js";  // ajuste o path se necessário

const router = express.Router();

// ─── MIDDLEWARE: verifica se o usuário é admin ─────────────────────────────────
async function requireAdmin(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, message: "Não autenticado" });

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ success: false, message: "Acesso negado — requer admin" });
    }
    next();
  } catch (e) {
    next(e);
  }
}

// ─── GET /admin/marketplace-parts ─────────────────────────────────────────────
// Lista anúncios filtrados por status (pending | approved | rejected | flagged)
router.get("/marketplace-parts", requireAdmin, async (req, res, next) => {
  try {
    const { status = "pending", limit = 50 } = req.query;

    let query = db.collection("marketplaceParts").where("moderationStatus", "==", status);
    query = query.orderBy("createdAt", "desc").limit(Number(limit));

    const snap = await query.get();
    const parts = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      // Busca dados do vendedor
      let seller = null;
      if (data.sellerId) {
        const sellerDoc = await db.collection("users").doc(data.sellerId).get();
        if (sellerDoc.exists) seller = { uid: sellerDoc.id, ...sellerDoc.data() };
      }
      parts.push({ id: doc.id, ...data, seller });
    }

    res.json({ success: true, data: parts });
  } catch (e) {
    next(e);
  }
});

// ─── GET /admin/marketplace-parts/stats ──────────────────────────────────────
// Retorna contadores de anúncios por status
router.get("/marketplace-parts/stats", requireAdmin, async (req, res, next) => {
  try {
    const statuses = ["pending", "approved", "rejected", "flagged"];
    const counts = {};

    await Promise.all(
      statuses.map(async (status) => {
        const snap = await db.collection("marketplaceParts")
          .where("moderationStatus", "==", status)
          .count()
          .get();
        counts[status] = snap.data().count;
      })
    );

    res.json({ success: true, data: counts });
  } catch (e) {
    next(e);
  }
});

// ─── PATCH /admin/marketplace-parts/:id/approve ──────────────────────────────
// Aprova um anúncio
router.patch("/marketplace-parts/:id/approve", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminUid = req.user.uid;

    await db.collection("marketplaceParts").doc(id).update({
      moderationStatus: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: adminUid,
      rejectionReason: null,
    });

    // Notifica o vendedor via Firestore (seu sistema de notificações pode usar isso)
    const partDoc = await db.collection("marketplaceParts").doc(id).get();
    const part = partDoc.data();
    if (part?.sellerId) {
      await db.collection("notifications").add({
        userId: part.sellerId,
        type: "listing_approved",
        title: "Anúncio aprovado! 🎉",
        message: `Seu anúncio "${part.name || "Peça"}" foi aprovado e já está visível no marketplace.`,
        partId: id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    res.json({ success: true, message: "Anúncio aprovado com sucesso" });
  } catch (e) {
    next(e);
  }
});

// ─── PATCH /admin/marketplace-parts/:id/reject ───────────────────────────────
// Rejeita um anúncio com motivo
router.patch("/marketplace-parts/:id/reject", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = "Não aprovado pela moderação" } = req.body;
    const adminUid = req.user.uid;

    await db.collection("marketplaceParts").doc(id).update({
      moderationStatus: "rejected",
      rejectedAt: new Date().toISOString(),
      rejectedBy: adminUid,
      rejectionReason: reason,
    });

    // Notifica o vendedor
    const partDoc = await db.collection("marketplaceParts").doc(id).get();
    const part = partDoc.data();
    if (part?.sellerId) {
      await db.collection("notifications").add({
        userId: part.sellerId,
        type: "listing_rejected",
        title: "Anúncio não aprovado",
        message: `Seu anúncio "${part.name || "Peça"}" foi rejeitado. Motivo: ${reason}`,
        partId: id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    res.json({ success: true, message: "Anúncio rejeitado" });
  } catch (e) {
    next(e);
  }
});

// ─── PATCH /admin/marketplace-parts/:id/flag ─────────────────────────────────
// Marca um anúncio como suspeito para revisão posterior
router.patch("/marketplace-parts/:id/flag", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note = "Marcado para revisão" } = req.body;
    const adminUid = req.user.uid;

    await db.collection("marketplaceParts").doc(id).update({
      moderationStatus: "flagged",
      flaggedAt: new Date().toISOString(),
      flaggedBy: adminUid,
      flagNote: note,
    });

    res.json({ success: true, message: "Anúncio marcado como suspeito" });
  } catch (e) {
    next(e);
  }
});

export default router;


// ─── MUDANÇA NECESSÁRIA NO MODELO DE DADOS ────────────────────────────────────
//
// Ao criar um novo anúncio via POST /marketplaceParts, adicione o campo:
//   moderationStatus: "pending"   ← padrão para todos os novos anúncios
//
// No marketplace.service.js (createMarketplacePartService), adicione:
//   moderationStatus: "pending",
//   approvedAt: null,
//   rejectedAt: null,
//   rejectionReason: null,
//
// Na listagem do marketplace (GET /marketplaceParts), filtre apenas aprovados:
//   WHERE moderationStatus = "approved"
//   Ou se ainda não tem o campo: mostre todos (retrocompatibilidade)
//
// Para vendedores PREMIUM (campo isPremium: true no Firestore):
//   Aprovar automaticamente na criação — defina moderationStatus: "approved" diretamente.
//   Isso pode ser feito verificando o usuário no middleware antes de salvar.
// ─────────────────────────────────────────────────────────────────────────────
