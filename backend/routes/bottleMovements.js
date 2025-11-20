const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT bottle_movements.*, clients.name AS clientName
      FROM bottle_movements
      LEFT JOIN clients ON clients.id = bottle_movements.clientId
      ORDER BY id DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo movimientos" });
  }
});

module.exports = router;
