const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener inventario de fardos vendidos agrupado por día
router.get("/", (req, res) => {
  const sql = `
    SELECT date AS fecha, SUM(fardos) AS total_fardos
    FROM orders
    WHERE estado = 'entregado'
    GROUP BY date
    ORDER BY date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("ERROR /api/fardos:", err);
      return res.status(500).json({ error: "Error obteniendo datos de fardos" });
    }

    res.json(rows);
  });
});

module.exports = router;
