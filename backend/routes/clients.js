const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los clientes
router.get("/", (req, res) => {
  const sql = "SELECT * FROM clients ORDER BY id DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("ERROR /api/clients:", err);
      return res.status(500).json({ error: "Error obteniendo clientes" });
    }
    res.json(rows);
  });
});

// Crear cliente
router.post("/", (req, res) => {
  const { name, phone, address, price_fardo, price_botellon, price_botellon_nuevo } = req.body;

  const sql = `
    INSERT INTO clients (name, phone, address, price_fardo, price_botellon, price_botellon_nuevo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, phone, address, price_fardo, price_botellon, price_botellon_nuevo],
    function (err) {
      if (err) {
        console.error("ERROR creando cliente:", err);
        return res.status(500).json({ error: "Error creando cliente" });
      }

      res.json({ id: this.lastID });
    }
  );
});

// Actualizar cliente
router.put("/:id", (req, res) => {
  const { name, phone, address, price_fardo, price_botellon, price_botellon_nuevo } = req.body;

  const sql = `
    UPDATE clients
    SET name = ?, phone = ?, address = ?, price_fardo = ?, price_botellon = ?, price_botellon_nuevo = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [name, phone, address, price_fardo, price_botellon, price_botellon_nuevo, req.params.id],
    function (err) {
      if (err) {
        console.error("ERROR actualizando cliente:", err);
        return res.status(500).json({ error: "Error actualizando cliente" });
      }

      res.json({ success: true });
    }
  );
});

// Eliminar cliente
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM clients WHERE id = ?";

  db.run(sql, req.params.id, function (err) {
    if (err) {
      console.error("ERROR eliminando cliente:", err);
      return res.status(500).json({ error: "Error eliminando cliente" });
    }

    res.json({ success: true });
  });
});

module.exports = router;
