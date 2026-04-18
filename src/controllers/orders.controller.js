import * as OrdersService from "../services/orders.service.js";
import { successResponse } from "../utils/response.js";
import AppError from "../errors/AppError.js";

export async function create(req, res, next) {
  try {
    const buyerId = req.user.uid;
    const order = await OrdersService.createOrder({ ...req.body, buyerId });
    return successResponse(res, order, {}, 201);
  } catch (error) {
    next(error);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const buyerId = req.user.uid;
    const orders = await OrdersService.getOrdersByBuyer(buyerId);
    return successResponse(res, orders);
  } catch (error) {
    next(error);
  }
}

// ─── Pedidos do vendedor com dados de comprador enriquecidos ──────────────────
export async function listSellerOrders(req, res, next) {
  try {
    const sellerId = req.user.uid;
    const { db } = await import("../config/firebase.js");

    // Busca pedidos que contêm itens do vendedor
    const snap = await db
      .collection("orders")
      .where("sellerIds", "array-contains", sellerId)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    // Fallback: se sellerIds não existir, busca por items.sellerId
    let orders = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() ?? null,
      updatedAt: doc.data().updatedAt?.toDate?.() ?? null,
    }));

    // Se não encontrou via sellerIds, tenta via items
    if (orders.length === 0) {
      const allSnap = await db
        .collection("orders")
        .orderBy("createdAt", "desc")
        .limit(500)
        .get();
      orders = allSnap.docs
        .filter((doc) => {
          const data = doc.data();
          return data.items?.some((item) => item.sellerId === sellerId);
        })
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() ?? null,
          updatedAt: doc.data().updatedAt?.toDate?.() ?? null,
        }));
    }

    // Enriquecer com nome do comprador (batch lookup)
    const buyerIds = [...new Set(orders.map((o) => o.buyerId).filter(Boolean))];
    const buyerDocs = await Promise.all(
      buyerIds.map((id) => db.collection("users").doc(id).get())
    );
    const buyerMap = {};
    buyerDocs.forEach((doc) => {
      if (doc.exists) buyerMap[doc.id] = doc.data().name || doc.data().email || "Comprador";
    });

    // Filtra apenas itens do vendedor e calcula total do vendedor
    const enriched = orders.map((order) => {
      const myItems = (order.items || []).filter((i) => i.sellerId === sellerId);
      const myTotal = myItems.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
      return {
        ...order,
        buyerName: buyerMap[order.buyerId] || "Comprador",
        myItems,
        myTotal,
      };
    });

    return successResponse(res, enriched);
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const uid = req.user.uid;

    // Apenas vendedor dos itens ou admin pode atualizar
    const doc = await (await import("../config/firebase.js")).db
      .collection("orders")
      .doc(orderId)
      .get();

    if (!doc.exists)
      throw new AppError("Pedido não encontrado", 404, "NOT_FOUND");

    const order = doc.data();
    const isBuyer = order.buyerId === uid;
    const isAdmin = req.user.isAdmin === true;
    const isSeller =
      order.items?.some((i) => i.sellerId === uid) || false;

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new AppError("Sem permissão para atualizar este pedido", 403, "FORBIDDEN");
    }

    const result = await OrdersService.updateOrderStatus(orderId, status);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
}
