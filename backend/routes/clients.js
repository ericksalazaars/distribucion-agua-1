// backend/routes/clients.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/clients
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM clients ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("ERROR GET /clients:", err);
    res.status(500).json({ error: "Error obteniendo clientes" });
  }
});

// POST /api/clients
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, price_fardo, price_botellon, price_botellon_nuevo } = req.body;
    const q = `
      INSERT INTO clients (name, phone, address, price_fardo, price_botellon, price_botellon_nuevo)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `;
    const { rows } = await db.query(q, [name, phone, address, price_fardo, price_botellon, price_botellon_nuevo]);
    res.json(rows[0]);
  } catch (err) {
    console.error("ERROR POST /clients:", err);
    res.status(500).json({ error: "Error creando cliente" });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM clients WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("ERROR DELETE /clients:", err);
    res.status(500).json({ error: "Error eliminando cliente" });
  }
});

module.exports = router;
