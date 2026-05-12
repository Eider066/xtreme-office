import db from "../db/pool.js";

// ===============================
// GET ALL PRODUCTS
// ===============================
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// ===============================
// GET PRODUCT BY ID
// ===============================
export const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// ===============================
// CREATE PRODUCT
// ===============================
export const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      price_usd,
      cost_usd,
      provider,
      stock,
      category,
      description,
      exchange_rate
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Convertir a número y evitar NaN
    const priceUsdNum = Number(price_usd) || 0;
    const exchangeRateNum = Number(exchange_rate) || 1; // default 1
    const costUsdNum = Number(cost_usd) || 0;
    const stockNum = Number(stock) || 0;

    // Calcular precio en bolívares
    const price_bs = priceUsdNum * exchangeRateNum;

    await db.query(
      `INSERT INTO products 
      (sku, name, price_usd, exchange_rate, price_bs, cost_usd, provider, stock, category, description, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sku,
        name,
        priceUsdNum,
        exchangeRateNum,
        price_bs,
        costUsdNum,
        provider,
        stockNum,
        category,
        description,
        image
      ]
    );

    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    await db.query("UPDATE products SET ? WHERE id = ?", [fields, id]);

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
export const deleteProduct = async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
// ===============================
// ADD STOCK (SUMAR AL STOCK EXISTENTE)
// ===============================
export const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const amountNum = Number(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return res.json({ success: false, error: "Cantidad inválida" });
    }

    await db.query(
      "UPDATE products SET stock = stock + ? WHERE id = ?",
      [amountNum, id]
    );

    res.json({ success: true, message: "Stock actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error agregando stock:", error);
    res.status(500).json({ error: "Error al agregar stock" });
  }
};
