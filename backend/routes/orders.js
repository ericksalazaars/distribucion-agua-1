const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================================
// GET — Obtener todos los pedidos
// ==========================================
router.get("/", (req, res) => {
  const sql = `
    SELECT o.*, c.name AS clientName
    FROM orders o
    LEFT JOIN clients c ON o.clientId = c.id
    ORDER BY o.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error obteniendo pedidos:", err);
      return res.status(500).json({ error: "Error obteniendo pedidos" });
    }
    res.json(rows);
  });
});

// ==========================================
// POST — Crear un pedido
// ==========================================
router.post("/", (req, res) => {
  const { clientId, date, fardos, botellones_solicitados, notas } = req.body;

  const sql = `
    INSERT INTO orders (clientId, date, fardos, botellones_solicitados, estado, notas)
    VALUES (?, ?, ?, ?, 'pendiente', ?)
  `;

  db.run(sql, [clientId, date, fardos, botellones_solicitados, notas], function (err) {
    if (err) {
      console.error("Error creando pedido:", err);
      return res.status(500).json({ error: "Error creando pedido" });
    }
    res.json({ id: this.lastID });
  });
});

// ==========================================
// PUT — Registrar entrega
// ==========================================
router.put("/:id/entregar", (req, res) => {
  const { entregados_llenos, botellones_recolectados } = req.body;
  const orderId = req.params.id;

  const updateSql = `
    UPDATE orders
    SET estado = 'entregado',
        entregados_llenos = ?,
        botellones_recolectados = ?
    WHERE id = ?
  `;

  db.run(updateSql, [entregados_llenos, botellones_recolectados, orderId], function (err) {
    if (err) {
      console.error("Error actualizando pedido:", err);
      return res.status(500).json({ error: "Error actualizando pedido" });
    }

    // Registrar movimientos de botellones
    const fechaMov = new Date().toISOString().split("T")[0];

    const movSql = `
      INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen)
      VALUES (?, ?, ?, ?, 'entrega')
    `;

    db.run(movSql, [req.body.clientId, "entregado", entregados_llenos, fechaMov]);
    db.run(movSql, [req.body.clientId, "recolectado", botellones_recolectados, fechaMov]);

    res.json({ updated: true });
  });
});

// ==========================================
// DELETE — Eliminar pedido
// ==========================================
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM orders WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error("Error eliminando pedido:", err);
      return res.status(500).json({ error: "Error eliminando pedido" });
    }
    res.json({ deleted: true });
  });
});

module.exports = router;
