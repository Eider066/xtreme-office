import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.js";
import adminsRoutes from "./routes/admins.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import categoriesRoutes from "./routes/categories.js";

import pool from "./db/pool.js";

dotenv.config();

const app = express();
app.use(cors());

// NECESARIO PARA JSON + FORM-DATA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVIR IMÁGENES SUBIDAS
app.use("/uploads", express.static("uploads"));


// -----------------------------------------
// 🔐 RUTAS API (ORDEN CORRECTO)
// -----------------------------------------

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api", authRoutes);

// ⭐ DASHBOARD (ANTES DEL CATCH-ALL)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoriesRoutes);

// -----------------------------------------
//  SERVIR FRONTEND (VITE/REACT)
// -----------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend/dist");

// Archivos estáticos del frontend
app.use(express.static(frontendPath));


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
//  CATCH-ALL FINAL (DEBE IR ÚLTIMO)
// -----------------------------------------
app.use((req, res) => {
  // Si empieza con /api → ruta no existe
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Ruta de API no encontrada" });
  }

  // Si no es API → devolver React
  res.sendFile(path.join(frontendPath, "index.html"));
});


// -----------------------------------------
//  INICIAR SERVIDOR
// -----------------------------------------

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
