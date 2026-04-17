import { db, admin } from "../config/firebase.js";
import AppError from "../errors/AppError.js";

export async function createMarketplacePartService(data) {
  const {
    oemNumber,
    name,
    brandId,
    categoryId,
    description,
    sellerId,
    price,
    stock,
    condition,
    warrantyMonths,
    images,
  } = data;

  const masterPartsRef = db.collection("masterParts");
  const masterQuery = await masterPartsRef
    .where("oemNumber", "==", oemNumber)
    .limit(1)
    .get();

  let masterPartId;
  if (masterQuery.empty) {
    const newMaster = await masterPartsRef.add({
      name,
      oemNumber,
      brandId: brandId || "",
      categoryId: categoryId || "",
      description: description || "",
      images: images || [],
      weightKg: 0,
      dimensions: { height: 0, width: 0, length: 0 },
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    masterPartId = newMaster.id;
  } else {
    masterPartId = masterQuery.docs[0].id;
    // Se o masterPart existia mas não tinha imagens, atualiza
    const existingMaster = masterQuery.docs[0].data();
    if (images?.length && (!existingMaster.images || !existingMaster.images.length)) {
      await masterPartsRef.doc(masterPartId).update({ images });
    }
  }

  const marketplaceRef = db.collection("marketplaceParts");
  const existingQuery = await marketplaceRef
    .where("sellerId", "==", sellerId)
    .where("masterPartId", "==", masterPartId)
    .limit(1)
    .get();

  if (!existingQuery.empty) {
    const doc = existingQuery.docs[0];
    const currentStock = doc.data().stock || 0;
    await marketplaceRef.doc(doc.id).update({
      stock: currentStock + Number(stock),
      price: Number(price),
      condition,
      warrantyMonths: Number(warrantyMonths || 0),
      images: images?.length ? images : doc.data().images || [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { message: "Estoque atualizado", marketplacePartId: doc.id };
  }

  // Verifica se o vendedor tem aprovação automática (isPremium ou sellerVerified)
  const sellerDoc = await db.collection("users").doc(sellerId).get();
  const sellerData = sellerDoc.exists ? sellerDoc.data() : {};
  const isAutoApproved = sellerData.isPremium === true || sellerData.sellerVerified === true;
  const moderationStatus = isAutoApproved ? "approved" : "pending";

  const newMarketplace = await marketplaceRef.add({
    sellerId,
    masterPartId,
    price: Number(price),
    stock: Number(stock),
    condition,
    warrantyMonths: Number(warrantyMonths || 0),
    images: images || [],
    // CORREÇÃO: active=true sempre para que o vendedor veja o próprio anúncio
    // moderationStatus controla visibilidade no marketplace público
    active: true,
    moderationStatus,
    approvedAt: isAutoApproved ? new Date().toISOString() : null,
    rejectedAt: null,
    rejectionReason: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Notifica vendedor sobre status
  if (!isAutoApproved) {
    await db.collection("notifications").add({
      userId: sellerId,
      type: "listing_pending",
      title: "Anúncio em análise",
      message: `Seu anúncio "${name}" foi enviado para moderação e ficará visível após aprovação.`,
      partId: newMarketplace.id,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {}); // não bloquear se falhar
  }

  return {
    message: isAutoApproved
      ? "Peça cadastrada e publicada com sucesso!"
      : "Peça cadastrada. Aguardando aprovação da moderação.",
    marketplacePartId: newMarketplace.id,
    moderationStatus,
  };
}

export async function updateMarketplacePartImages(
  marketplacePartId,
  sellerId,
  newImages
) {
  const ref = db.collection("marketplaceParts").doc(marketplacePartId);
  const doc = await ref.get();

  if (!doc.exists) throw new AppError("Peça não encontrada", 404, "NOT_FOUND");
  if (doc.data().sellerId !== sellerId)
    throw new AppError("Sem permissão para editar esta peça", 403, "FORBIDDEN");

  const currentImages = doc.data().images || [];
  const merged = [...currentImages, ...newImages].slice(0, 4);

  // Atualiza também no masterPart se ainda sem imagens
  const masterRef = db
    .collection("masterParts")
    .doc(doc.data().masterPartId);
  const masterDoc = await masterRef.get();
  if (
    masterDoc.exists &&
    (!masterDoc.data().images || !masterDoc.data().images.length)
  ) {
    await masterRef.update({ images: merged });
  }

  await ref.update({
    images: merged,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { marketplacePartId, images: merged };
}
