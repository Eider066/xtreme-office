import pool from "./db/pool.js";

(async () => {
  try {
    const [rows] = await pool.query("SELECT DATABASE();");
    console.log("Conectado a:", rows[0]);
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
