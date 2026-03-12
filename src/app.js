import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

// Routes
import vehiclesRoutes from "./routes/vehicles.routes.js";
import vehiclesApplicationsRoutes from "./routes/vehiclesApplications.routes.js";
import vehiclesPartsRoutes from "./routes/vehiclesParts.routes.js";
import partsRoutes from "./routes/parts.routes.js";
import compatibilitiesRoutes from "./routes/compatibilities.routes.js";
import searchRoutes from "./routes/search.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import plateRoutes from "./routes/plate.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health check para Railway
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));



// API Routes
app.use("/vehicles", vehiclesRoutes);
app.use("/vehicles", vehiclesApplicationsRoutes);
app.use("/vehicles", vehiclesPartsRoutes);
app.use("/parts", partsRoutes);
app.use("/compatibilities", compatibilitiesRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/marketplaceParts", marketplaceRoutes);
app.use("/plate-search", plateRoutes);
app.use("/orders", ordersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/payments", paymentRoutes);

// Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler (sempre por último)
app.use(errorMiddleware);

export default app;
