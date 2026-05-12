import db from "../db/connection.js";

export const ProductModel = {
  getAll: () => {
    return db.query("SELECT * FROM products");
  },

  getById: (id) => {
    return db.query("SELECT * FROM products WHERE id = ?", [id]);
  },

  create: (data) => {
    return db.query("INSERT INTO products SET ?", data);
  },

  update: (id, data) => {
    return db.query("UPDATE products SET ? WHERE id = ?", [data, id]);
  },

  delete: (id) => {
    return db.query("DELETE FROM products WHERE id = ?", [id]);
  }
};
