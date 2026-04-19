import { runAgent } from "../services/agent.service.js";
import AppError from "../errors/AppError.js";
import { db } from "../config/firebase.js";

export async function chat(req, res, next) {
  try {
    const { message } = req.body;
    const userId = req.user.uid;

    if (!message?.trim()) {
      throw new AppError("Mensagem não pode estar vazia", 400, "VALIDATION_ERROR");
    }

    // Busca o perfil do usuário no Firestore para determinar o modo do agente
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Determina o perfil: desmanche > vendedor > comprador
    let profile = "buyer";
    if (userData.isDismantler === true) {
      profile = "dismantler";
    } else if (userData.isSeller === true || userData.role === "seller") {
      profile = "seller";
    }

    const reply = await runAgent({ message: message.trim(), profile });

    return res.json({ success: true, data: { reply, profile } });
  } catch (error) {
    next(error);
  }
}
