import { db, admin } from "../config/firebase.js";
import { uploadImage } from "../services/cloudinary.service.js";
import AppError from "../errors/AppError.js";
import logger from "../utils/logger.js";

export async function createUserProfile(req, res, next) {
  try {
    const uid = req.user.uid;
    const email = req.user.email;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.json({ success: true, message: "Usuário já existe", data: userDoc.data() });
    }

    const newUser = {
      name: req.body.name || null,
      email,
      type: req.body.type || "buyer",
      sellerVerified: false,
      isPremium: false,
      isAdmin: false,
      active: true,
      ratingAvg: null,
      ratingCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(newUser);
    logger.info("Novo usuário criado", { uid, email });
    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const uid = req.user.uid;
    const { name, bio, specialty, coords, plan } = req.body;

    // Apenas campos não-sensíveis podem ser alterados por este endpoint
    const updates = {};
    if (typeof name === "string" && name.trim()) updates.name = name.trim().slice(0, 100);
    if (typeof bio === "string") updates.bio = bio.trim().slice(0, 300);
    if (typeof specialty === "string") updates.specialty = specialty.trim().slice(0, 100);
    if (coords && typeof coords.lat === "number" && typeof coords.lng === "number") {
      updates.coords = { lat: coords.lat, lng: coords.lng };
    }
    if (plan === "premium" || plan === "free") updates.plan = plan;

    if (!Object.keys(updates).length) {
      throw new AppError("Nenhum campo válido para atualizar", 400, "VALIDATION_ERROR");
    }

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection("users").doc(uid).update(updates);

    logger.info("Perfil atualizado", { uid });
    return res.json({ success: true, data: updates });
  } catch (error) {
    next(error);
  }
}

export async function updateUserPhoto(req, res, next) {  try {
    const uid = req.user.uid;
    if (!req.file) throw new AppError("Nenhuma foto enviada", 400, "NO_FILE");

    const { url } = await uploadImage(req.file.buffer, "profiles");

    await db.collection("users").doc(uid).update({
      photo: url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info("Foto de usuário atualizada", { uid });
    return res.json({ success: true, data: { photo: url } });
  } catch (error) {
    next(error);
  }
}

export async function getMyProfile(req, res, next) {
  try {
    const uid = req.user.uid;
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) throw new AppError("Perfil não encontrado", 404, "NOT_FOUND");

    const { isAdmin, ...safeData } = doc.data();
    return res.json({ success: true, data: { id: doc.id, ...safeData } });
  } catch (error) {
    next(error);
  }
}
