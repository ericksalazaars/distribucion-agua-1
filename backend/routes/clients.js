const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los clientes
router.get("/", (req, res) => {
  db.all("SELECT * FROM clients", [], (err, rows) => {
    if (err) {
      console.error("ERROR /api/clients:", err);
      return res.status(500).json({ error: "Error al obtener clientes" });
    }
    res.json(rows);
  });
});

// Crear cliente
router.post("/", (req, res) => {
  const { name, phone, address, price_fardo, price_botellon, price_botellon_nuevo } = req.body;

  db.run(
    `INSERT INTO clients (name, phone, address, price_fardo, price_botellon, price_botellon_nuevo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, phone, address, price_fardo, price_botellon, price_botellon_nuevo],
    function (err) {
      if (err) {
        console.error("ERROR creando cliente:", err);
        return res.status(500).json({ error: "No se pudo crear el cliente" });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Eliminar cliente
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM clients WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar cliente" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
