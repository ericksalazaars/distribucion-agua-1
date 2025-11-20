const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT date, SUM(fardos) AS total_fardos
      FROM orders
      GROUP BY date
      ORDER BY date DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo fardos" });
  }
});

module.exports = router;
