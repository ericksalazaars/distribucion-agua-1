const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener clientes
router.get("/", (req, res) => {
  try {
    const clients = db.prepare("SELECT * FROM clients").all();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo clientes" });
  }
});

// Crear cliente
router.post("/", (req, res) => {
  const { name, phone, address, price_fardo, price_botellon, price_botellon_nuevo } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO clients (name, phone, address, price_fardo, price_botellon, price_botellon_nuevo)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name, phone, address, price_fardo, price_botellon, price_botellon_nuevo);

    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: "Error creando cliente" });
  }
});

module.exports = router;
