import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.js";
import adminsRoutes from "./routes/admins.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import categoriesRoutes from "./routes/categories.js";

import pool from "./db/pool.js";

dotenv.config();

const app = express();

// -----------------------------------------
// ✅ CORS CONFIG (Render + Frontend)
// -----------------------------------------
app.use(cors({
  origin: "https://xtreme-office-frontend.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// NECESARIO PARA JSON + FORM-DATA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVIR IMÁGENES SUBIDAS
app.use("/uploads", express.static("uploads"));

// -----------------------------------------
// 🔐 RUTAS API
// -----------------------------------------
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoriesRoutes);

// -----------------------------------------
//  TEST DB
// -----------------------------------------
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------
//  CATCH-ALL SOLO PARA API
// -----------------------------------------
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Ruta de API no encontrada" });
  }
  res.status(404).send("Not found");
});

// -----------------------------------------
//  INICIAR SERVIDOR
// -----------------------------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
