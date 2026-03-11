import { db, admin } from "../config/firebase.js";

export async function createOrder(data) {
  const { buyerId, items, total, shippingAddress, skipStockDecrement = false } = data;

  // Valida estoque antes de criar o pedido
  for (const item of items) {
    const doc = await db.collection("marketplaceParts").doc(item.marketplacePartId).get();
    if (!doc.exists) throw new Error(`Peça ${item.marketplacePartId} não encontrada`);
    const part = doc.data();
    if (!part.active) throw new Error(`Peça ${item.name} não está mais disponível`);
    if (part.stock < item.quantity) throw new Error(`Estoque insuficiente para: ${item.name}`);
  }

  // Cria o pedido
  const initialStatus = skipStockDecrement ? "awaiting_payment" : "pending";
  const orderRef = await db.collection("orders").add({
    buyerId,
    items,
    total: Number(total),
    shippingAddress: shippingAddress || null,
    status: initialStatus,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Decrementa estoque apenas se não for via pagamento MP
  if (!skipStockDecrement) {
    const batch = db.batch();
    for (const item of items) {
      const ref = db.collection("marketplaceParts").doc(item.marketplacePartId);
      batch.update(ref, {
        stock: admin.firestore.FieldValue.increment(-item.quantity),
      });
    }
    await batch.commit();
  }

  return { orderId: orderRef.id, status: initialStatus };
}

export async function getOrdersByBuyer(buyerId) {
  const snap = await db
    .collection("orders")
    .where("buyerId", "==", buyerId)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? null,
  }));
}

export async function getOrdersBySeller(sellerId) {
  // Busca pedidos que contenham itens do vendedor
  const snap = await db
    .collection("orders")
    .where("items", "array-contains-any", [{ sellerId }])
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? null,
  }));
}

export async function updateOrderStatus(orderId, status) {
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Status inválido");

  await db.collection("orders").doc(orderId).update({ status });
  return { orderId, status };
}
