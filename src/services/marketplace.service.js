import { db, admin } from "../config/firebase.js";

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
      brandId,
      categoryId,
      description,
      images: images || [],
      weightKg: 0,
      dimensions: {
        height: 0,
        width: 0,
        length: 0,
      },
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    masterPartId = newMaster.id;
  } else {
    masterPartId = masterQuery.docs[0].id;
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
    });

    return {
      message: "Estoque atualizado",
      marketplacePartId: doc.id,
    };
  }

  const newMarketplace = await marketplaceRef.add({
    sellerId,
    masterPartId,
    price: Number(price),
    stock: Number(stock),
    condition,
    warrantyMonths: Number(warrantyMonths),
    images: images || [],
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    message: "Peça cadastrada no marketplace",
    marketplacePartId: newMarketplace.id,
  };
}
export async function updateMarketplacePartImages(marketplacePartId, sellerId, newImages) {
  const ref = db.collection("marketplaceParts").doc(marketplacePartId);
  const doc = await ref.get();

  if (!doc.exists) throw new Error("Peça não encontrada");
  if (doc.data().sellerId !== sellerId) throw new Error("Sem permissão para editar esta peça");

  const currentImages = doc.data().images || [];
  // Mantém até 4 fotos no total
  const merged = [...currentImages, ...newImages].slice(0, 4);

  // Atualiza também no masterPart se não tiver imagens
  const masterRef = db.collection("masterParts").doc(doc.data().masterPartId);
  const masterDoc = await masterRef.get();
  if (masterDoc.exists && (!masterDoc.data().images || !masterDoc.data().images.length)) {
    await masterRef.update({ images: merged });
  }

  await ref.update({ images: merged, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return { marketplacePartId, images: merged };
}
