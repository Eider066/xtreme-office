import { Router } from "express";
import pool from "../db/pool.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Productos con stock bajo
router.get("/low-stock", authMiddleware, async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const [rows] = await pool.query(
      `
      SELECT id, name, sku, stock, price_usd, category
      FROM products
      WHERE stock <= ?
      ORDER BY stock ASC
      `,
      [threshold]
    );

    res.json({
      success: true,
      data: rows,
      threshold
    });
  } catch (err) {
    console.error("🔥 ERROR INVENTORY LOW-STOCK:", err);
    res.status(500).json({ success: false, error: "Error al obtener inventario" });
  }
});

export default router;
