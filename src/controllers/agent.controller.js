import { runAgent } from "../services/agent.service.js";
import AppError from "../errors/AppError.js";
import { db } from "../config/firebase.js";

export async function chat(req, res, next) {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user.uid;

    if (!message?.trim()) {
      throw new AppError("Mensagem não pode estar vazia", 400, "VALIDATION_ERROR");
    }

    // Valida histórico: deve ser array de objetos com role + content
    if (!Array.isArray(history)) {
      throw new AppError("history deve ser um array", 400, "VALIDATION_ERROR");
    }
    const validHistory = history
      .filter((m) => m && typeof m.role === "string" && typeof m.content === "string")
      .slice(-20); // limita no controller também por segurança

    // Busca o perfil do usuário no Firestore para determinar o modo do agente
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Determina o perfil: desmanche > vendedor > comprador
    // O campo "type" é o principal (cadastro via frontend)
    // "isDismantler" / "isSeller" são campos legados — suportados por retrocompatibilidade
    let profile = "buyer";
    if (userData.type === "dismantler" || userData.isDismantler === true) {
      profile = "dismantler";
    } else if (
      userData.type === "seller" ||
      userData.isSeller === true ||
      userData.role === "seller"
    ) {
      profile = "seller";
    }

    const reply = await runAgent({ message: message.trim(), profile, history: validHistory });

    return res.json({ success: true, data: { reply, profile } });
  } catch (error) {
    next(error);
  }
}
