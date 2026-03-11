import { createPaymentPreference, processWebhook } from "../services/payment.service.js";
import { createOrder } from "../services/orders.service.js";
import { successResponse } from "../utils/response.js";
import { db } from "../config/firebase.js";

/**
 * POST /payments/create
 * Cria pedido + preferência no MP e retorna a URL de pagamento
 */
export async function createPayment(req, res, next) {
  try {
    const buyerId = req.user.uid;
    const buyerEmail = req.user.email;
    const { items, total } = req.body;

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "Carrinho vazio" });
    }

    // 1. Cria o pedido no Firestore (status: awaiting_payment)
    const order = await createOrder({ buyerId, items, total, skipStockDecrement: true });

    // 2. Cria preferência no Mercado Pago
    const preference = await createPaymentPreference({
      orderId: order.orderId,
      items,
      buyerEmail,
      buyerId,
    });

    return successResponse(res, {
      orderId: order.orderId,
      preferenceId: preference.preferenceId,
      initPoint: preference.initPoint,
    }, {}, 201);

  } catch (error) {
    console.error("❌ Erro em createPayment:", error?.message);
    next(error);
  }
}

/**
 * POST /payments/webhook
 * Recebe notificações do Mercado Pago
 */
export async function webhook(req, res) {
  try {
    const { type, data } = req.body;
    const result = await processWebhook({ type, data });
    console.log("🔔 Webhook MP processado:", result);
    return res.status(200).json({ received: true, ...result });
  } catch (error) {
    console.error("❌ Erro no webhook MP:", error.message);
    return res.status(200).json({ received: true, error: error.message });
  }
}

/**
 * GET /payments/status/:orderId
 * Consulta status do pagamento de um pedido
 */
export async function getPaymentStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const buyerId = req.user.uid;

    const doc = await db.collection("orders").doc(orderId).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: "Pedido não encontrado" });

    const order = doc.data();
    if (order.buyerId !== buyerId) return res.status(403).json({ success: false, message: "Acesso negado" });

    return successResponse(res, {
      orderId,
      status: order.status,
      mpPaymentStatus: order.mpPaymentStatus || null,
      mpPaymentMethod: order.mpPaymentMethod || null,
      paidAt: order.paidAt?.toDate?.() || null,
      total: order.total,
    });
  } catch (error) {
    next(error);
  }
}
