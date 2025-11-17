// backend/routes/bottleMovements.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/bottle-movements
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT bm.*, c.name AS clientname
      FROM bottle_movements bm
      LEFT JOIN clients c ON c.id = bm.clientid
      ORDER BY bm.id DESC
    `;
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("ERROR GET /bottle-movements:", err);
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
});

// GET /api/bottle-movements/resumen
router.get("/resumen", async (req, res) => {
  try {
    const sql = `
      SELECT
        c.id AS clientid,
        c.name AS clientname,
        COALESCE(SUM(CASE WHEN bm.tipo='entregado' THEN bm.cantidad END),0) AS entregados,
        COALESCE(SUM(CASE WHEN bm.tipo='recolectado' THEN bm.cantidad END),0) AS recolectados,
        COALESCE(
          SUM(CASE WHEN bm.tipo='recolectado' THEN bm.cantidad END) -
          SUM(CASE WHEN bm.tipo='entregado' THEN bm.cantidad END),0
        ) AS saldo
      FROM clients c
      LEFT JOIN bottle_movements bm ON bm.clientid = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("ERROR resumen bottle-movements:", err);
    res.status(500).json({ error: "Error en resumen" });
  }
});

module.exports = router;
