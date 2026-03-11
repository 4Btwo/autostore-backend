import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { db, admin } from "../config/firebase.js";

// Inicializa o cliente MP com o Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * e salva o pedido no Firestore com status "awaiting_payment"
 */
export async function createPaymentPreference({ orderId, items, buyerEmail, buyerId }) {
  const preference = new Preference(client);

  // Monta os itens no formato do MP
  const mpItems = items.map(item => ({
    id: item.marketplacePartId,
    title: item.name || "Peça Automotiva",
    description: `OEM: ${item.oemNumber || "—"}`,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
    currency_id: "BRL",
  }));

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const preferenceData = {
    items: mpItems,
    payer: {
      email: buyerEmail,
    },
    external_reference: orderId, // liga o pagamento ao pedido
    back_urls: {
      success: `${process.env.FRONTEND_URL}/pagamento/sucesso?orderId=${orderId}`,
      failure: `${process.env.FRONTEND_URL}/pagamento/falha?orderId=${orderId}`,
      pending: `${process.env.FRONTEND_URL}/pagamento/pendente?orderId=${orderId}`,
    },
    // auto_return só funciona com URLs públicas (não localhost)
    ...(process.env.FRONTEND_URL?.startsWith("https") && { auto_return: "approved" }),
    notification_url: `${process.env.BACKEND_URL}/payments/webhook`,
    statement_descriptor: "AUTOSTORE",
    metadata: {
      orderId,
      buyerId,
    },
  };

  const result = await preference.create({ body: preferenceData });

  // Atualiza o pedido com o ID da preferência
  await db.collection("orders").doc(orderId).update({
    mpPreferenceId: result.id,
    mpInitPoint: result.init_point,
    status: "awaiting_payment",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    preferenceId: result.id,
    initPoint: result.init_point, // URL para redirecionar o usuário
  };
}

/**
 * Processa o webhook do Mercado Pago
 * Atualiza o status do pedido conforme o pagamento
 */
export async function processWebhook({ type, data }) {
  if (type !== "payment") return { ignored: true };

  const payment = new Payment(client);
  const paymentData = await payment.get({ id: data.id });

  const orderId = paymentData.external_reference;
  if (!orderId) return { ignored: true, reason: "no external_reference" };

  const orderRef = db.collection("orders").doc(orderId);
  const orderDoc = await orderRef.get();
  if (!orderDoc.exists) return { ignored: true, reason: "order not found" };

  const mpStatus = paymentData.status;

  // Mapeia status do MP para status do sistema
  const statusMap = {
    approved:     "confirmed",
    pending:      "awaiting_payment",
    in_process:   "awaiting_payment",
    rejected:     "payment_failed",
    cancelled:    "cancelled",
    refunded:     "refunded",
    charged_back: "refunded",
  };

  const newStatus = statusMap[mpStatus] || "awaiting_payment";
  const orderData = orderDoc.data();

  // Só decrementa estoque se pagamento aprovado e ainda não foi processado
  if (mpStatus === "approved" && orderData.status !== "confirmed") {
    const batch = db.batch();
    for (const item of orderData.items || []) {
      if (item.marketplacePartId) {
        const ref = db.collection("marketplaceParts").doc(item.marketplacePartId);
        batch.update(ref, {
          stock: admin.firestore.FieldValue.increment(-Number(item.quantity)),
        });
      }
    }
    await batch.commit();
  }

  // Se pagamento falhou/cancelado e estoque já tinha sido decrementado, reverte
  if (["cancelled", "payment_failed", "refunded"].includes(newStatus) && orderData.status === "confirmed") {
    const batch = db.batch();
    for (const item of orderData.items || []) {
      if (item.marketplacePartId) {
        const ref = db.collection("marketplaceParts").doc(item.marketplacePartId);
        batch.update(ref, {
          stock: admin.firestore.FieldValue.increment(Number(item.quantity)),
        });
      }
    }
    await batch.commit();
  }

  await orderRef.update({
    status: newStatus,
    mpPaymentId: String(data.id),
    mpPaymentStatus: mpStatus,
    mpPaymentMethod: paymentData.payment_method_id || null,
    paidAt: mpStatus === "approved" ? admin.firestore.FieldValue.serverTimestamp() : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { orderId, newStatus, mpStatus };
}
