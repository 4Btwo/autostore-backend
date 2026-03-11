import {db} from "../config/firebase.js";

export async function createUserProfile(req, res) {
  try {

    const uid = req.user.uid;
    const email = req.user.email;

    const userRef = db.collection("users").doc(uid);

    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.json({
        success: true,
        message: "Usuário já existe"
      });
    }

    const newUser = {
      name: req.body.name || null,
      email: email,
      type: req.body.type || "buyer",
      sellerVerified: false,
      active: true,
      createdAt: new Date()
    };

    await userRef.set(newUser);

    return res.json({
      success: true,
      data: newUser
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
}