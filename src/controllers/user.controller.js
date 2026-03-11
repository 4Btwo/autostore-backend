import { db, admin } from "../config/firebase.js";
import { uploadImage } from "../services/cloudinary.service.js";

export async function createUserProfile(req, res) {
  try {
    const uid = req.user.uid;
    const email = req.user.email;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.json({ success: true, message: "Usuário já existe" });
    }

    const newUser = {
      name: req.body.name || null,
      email: email,
      type: req.body.type || "buyer",
      sellerVerified: false,
      active: true,
      createdAt: new Date(),
    };

    await userRef.set(newUser);
    return res.json({ success: true, data: newUser });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateUserPhoto(req, res, next) {
  try {
    const uid = req.user.uid;
    if (!req.file) return res.status(400).json({ success: false, message: "Nenhuma foto enviada" });

    const { url } = await uploadImage(req.file.buffer, "profiles");

    await db.collection("users").doc(uid).update({
      photo: url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ success: true, data: { photo: url } });
  } catch (error) {
    next(error);
  }
}
