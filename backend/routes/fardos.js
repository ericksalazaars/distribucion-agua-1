// backend/routes/fardos.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/fardos
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT date, SUM(fardos)::int as total_fardos
      FROM orders
      WHERE estado = 'entregado'
      GROUP BY date
      ORDER BY date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("ERROR /api/fardos:", err);
    res.status(500).json({ error: "Error obteniendo fardos" });
  }
});

module.exports = router;
