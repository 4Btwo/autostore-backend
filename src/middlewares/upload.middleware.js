import multer from "multer";

// Usa memoryStorage em vez de diskStorage.
// Motivo: os arquivos são enviados diretamente ao Cloudinary via buffer,
// então gravar no disco é desnecessário e incompatível com ambientes serverless.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"), false);
    }
  },
});

export default upload;