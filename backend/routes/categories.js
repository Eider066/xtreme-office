import { Router } from "express";
import pool from "../db/pool.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Listar categorías
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM categories ORDER BY name ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("🔥 ERROR GET CATEGORIES:", err);
    res.status(500).json({ success: false, error: "Error al obtener categorías" });
  }
});

// Crear categoría
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Nombre requerido" });
    }

    await pool.query("INSERT INTO categories (name) VALUES (?)", [name.trim()]);
    res.json({ success: true, message: "Categoría creada" });
  } catch (err) {
    console.error("🔥 ERROR CREATE CATEGORY:", err);
    res.status(500).json({ success: false, error: "Error al crear categoría" });
  }
});

// Actualizar categoría
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Nombre requerido" });
    }

    await pool.query("UPDATE categories SET name = ? WHERE id = ?", [name.trim(), id]);
    res.json({ success: true, message: "Categoría actualizada" });
  } catch (err) {
    console.error("🔥 ERROR UPDATE CATEGORY:", err);
    res.status(500).json({ success: false, error: "Error al actualizar categoría" });
  }
});

// Eliminar categoría
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: bloquear si hay productos con esa categoría
    // const [rows] = await pool.query("SELECT COUNT(*) AS total FROM products WHERE category_id = ?", [id]);
    // if (rows[0].total > 0) return res.status(400).json({ success: false, error: "Categoría en uso" });

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ success: true, message: "Categoría eliminada" });
  } catch (err) {
    console.error("🔥 ERROR DELETE CATEGORY:", err);
    res.status(500).json({ success: false, error: "Error al eliminar categoría" });
  }
});

export default router;
