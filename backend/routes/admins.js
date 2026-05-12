import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../db/pool.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

/* -------------------------------------------
   1) Saber si ya existe un administrador
------------------------------------------- */
router.get("/exists", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM admins");
    res.json({ exists: rows[0].total > 0 });
  } catch (err) {
    console.error("🔥 ERROR EXISTS:", err);
    res.status(500).json({ error: "Error al verificar admins" });
  }
});

/* -------------------------------------------
   2) Registrar el PRIMER superadmin
------------------------------------------- */
router.post("/register-first", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM admins");

    if (rows[0].total > 0) {
      return res.status(403).json({ error: "Ya existe un administrador" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO admins (email, password_hash) VALUES (?, ?)",
      [email, hash]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 ERROR REGISTRO:", err);
    res.status(500).json({ error: "Error al registrar superadmin" });
  }
});

/* -------------------------------------------
   3) Login normal
------------------------------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const admin = rows[0];

    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ success: true, token });

  } catch (err) {
    console.error("🔥 ERROR LOGIN:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* -------------------------------------------
   4) Ruta protegida
------------------------------------------- */
router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Ruta de admins protegida", admin: req.admin });
});

export default router;
