import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addStock
} from "../controllers/productsController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

// Crear producto (con imagen)
router.post("/", upload.single("image"), createProduct);

// ⭐ EDITAR PRODUCTO (con imagen opcional)
router.put("/:id", upload.single("image"), updateProduct);

// ⭐ SUMAR STOCK
router.patch("/:id/add-stock", addStock);

// Eliminar producto
router.delete("/:id", deleteProduct);

export default router;
