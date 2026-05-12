import { Router } from "express";
import pool from "../db/pool.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const [[products]] = await pool.query("SELECT COUNT(*) AS total FROM products");
    const [[orders]] = await pool.query("SELECT COUNT(*) AS total FROM orders");
    const [[pending]] = await pool.query("SELECT COUNT(*) AS total FROM orders WHERE status = 'pendiente'");
    const [[sales]] = await pool.query("SELECT SUM(total) AS total FROM orders");

    res.json({
      products: products.total,
      orders: orders.total,
      pending: pending.total,
      sales: sales.total || 0
    });
  } catch (err) {
    console.error("🔥 ERROR DASHBOARD SUMMARY:", err);
    res.status(500).json({ error: "Error al obtener datos del dashboard" });
  }
});

router.get("/latest-orders", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, customer_name, total, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR LATEST ORDERS:", err);
    res.status(500).json({ error: "Error al obtener últimas órdenes" });
  }
});

export default router;
