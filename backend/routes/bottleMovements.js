const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET — Movimientos recientes
// ===============================
router.get("/", (req, res) => {
  const sql = `
    SELECT m.*, c.name AS clientName
    FROM bottle_movements m
    LEFT JOIN clients c ON m.clientId = c.id
    ORDER BY m.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error obteniendo movimientos:", err);
      return res.status(500).json({ error: "Error obteniendo movimientos" });
    }
    res.json(rows);
  });
});

// ===============================
// GET — Resumen del día
// ===============================
router.get("/resumen", (req, res) => {
  const hoy = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT tipo, SUM(cantidad) AS total
    FROM bottle_movements
    WHERE fecha = ?
    GROUP BY tipo
  `;

  db.all(sql, [hoy], (err, rows) => {
    if (err) {
      console.error("Error obteniendo resumen:", err);
      return res.status(500).json({ error: "Error obteniendo resumen" });
    }

    let entregados = 0;
    let recolectados = 0;

    rows.forEach((r) => {
      if (r.tipo === "entregado") entregados = r.total;
      if (r.tipo === "recolectado") recolectados = r.total;
    });

    res.json({
      entregados,
      recolectados,
      balance: recolectados - entregados,
    });
  });
});

module.exports = router;
