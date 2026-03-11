import admin from "firebase-admin";

export async function authenticate(req, res, next) {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token não enviado"
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Token inválido",
      error: error.message
    });

  }
}