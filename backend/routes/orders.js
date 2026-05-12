import { Router } from "express";
import db from "../db/pool.js";

const router = Router();

// Ping
router.get("/", (req, res) => {
  res.json({ message: "Orders OK" });
});

// 📌 LISTAR ÓRDENES (con paginación)
router.get("/list", async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(
      `SELECT id, customer_name, customer_email, total, status, created_at
       FROM orders
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM orders"
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
      },
    });
  } catch (err) {
    console.error("❌ Error listando órdenes:", err);
    res.json({ success: false, error: "Error obteniendo órdenes" });
  }
});

// 📌 DETALLE DE UNA ORDEN
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (!orders.length) {
      return res.json({ success: false, error: "Orden no encontrada" });
    }

    const order = orders[0];

    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        order,
        items,
      },
    });
  } catch (err) {
    console.error("❌ Error obteniendo orden:", err);
    res.json({ success: false, error: "Error obteniendo orden" });
  }
});

// 📌 CAMBIAR ESTADO DE ORDEN (MEJORADO)
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  const allowed = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];
  if (!allowed.includes(newStatus)) {
    return res.json({ success: false, error: "Estado inválido" });
  }

  try {
    // 1️⃣ Obtener orden actual
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (!orders.length) {
      return res.json({ success: false, error: "Orden no encontrada" });
    }

    const order = orders[0];
    const previousStatus = order.status;

    // 2️⃣ Reglas PRO de transición de estados
    if (previousStatus === "entregado") {
      return res.json({
        success: false,
        error: "No puedes modificar una orden entregada",
      });
    }

    if (previousStatus === "cancelado") {
      return res.json({
        success: false,
        error: "No puedes modificar una orden cancelada",
      });
    }

    // 3️⃣ Si se cancela, devolver stock SOLO si venía de un estado que descuenta stock
    const shouldReturnStock =
      newStatus === "cancelado" &&
      (previousStatus === "pendiente" || previousStatus === "procesando");

    if (shouldReturnStock) {
      const [items] = await db.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [id]
      );

      for (const item of items) {
        await db.query(
          "UPDATE products SET stock = stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    // 4️⃣ Actualizar estado
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    res.json({ success: true, message: "Estado actualizado correctamente" });

  } catch (err) {
    console.error("❌ Error actualizando estado:", err);
    res.json({ success: false, error: "Error actualizando estado" });
  }
});

// 📌 CREAR ORDEN + DESCONTAR STOCK
router.post("/", async (req, res) => {
  console.log("🔥 BODY RECIBIDO:", req.body);

  const {
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod,
    paymentReference,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    delivery_method,
  } = req.body;

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1️⃣ Verificar stock
    for (const item of items) {
      const [rows] = await connection.query(
        "SELECT stock FROM products WHERE id = ?",
        [item.id]
      );

      if (!rows.length) throw new Error(`Producto no encontrado: ${item.name}`);

      if (rows[0].stock < item.qty)
        throw new Error(`Stock insuficiente para ${item.name}`);
    }

    // 2️⃣ Descontar stock
    for (const item of items) {
      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.qty, item.id]
      );
    }

    // 3️⃣ Crear orden
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (subtotal, shipping, tax, total, paymentMethod, paymentReference, 
         customer_name, customer_email, customer_phone, customer_address, delivery_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
        paymentReference,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        delivery_method,
      ]
    );

    const orderId = orderResult.insertId;

    // 4️⃣ Guardar items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.qty, item.price_usd]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      orderId,
      message: `Compra registrada correctamente. Tu número de orden es #${orderId}.`,
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("❌ Error creando orden:", error);
    res.json({ success: false, error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
