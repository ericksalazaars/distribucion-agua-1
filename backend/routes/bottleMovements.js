const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los movimientos de botellones
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      bm.*,
      c.name AS clientName
    FROM bottle_movements bm
    LEFT JOIN clients c ON c.id = bm.clientId
    ORDER BY bm.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ ERROR obteniendo movimientos:", err);
      return res.status(500).json({ error: "Error al obtener movimientos" });
    }

    res.json(rows);
  });
});

// Obtener resumen por cliente (saldo actual)
router.get("/resumen", (req, res) => {
  const sql = `
    SELECT 
      c.id AS clientId,
      c.name AS clientName,
      COALESCE(SUM(CASE WHEN bm.tipo = 'entregado' THEN bm.cantidad ELSE 0 END), 0) AS entregados,
      COALESCE(SUM(CASE WHEN bm.tipo = 'recolectado' THEN bm.cantidad ELSE 0 END), 0) AS recolectados,
      (COALESCE(SUM(CASE WHEN bm.tipo = 'recolectado' THEN bm.cantidad ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN bm.tipo = 'entregado' THEN bm.cantidad ELSE 0 END), 0)) AS saldo
    FROM clients c
    LEFT JOIN bottle_movements bm ON bm.clientId = c.id
    GROUP BY c.id
    ORDER BY c.name ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ ERROR en resumen:", err);
      return res.status(500).json({ error: "Error al generar resumen" });
    }

    res.json(rows);
  });
});

module.exports = router;
