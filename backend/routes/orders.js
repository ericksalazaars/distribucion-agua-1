const express = require("express");
const router = express.Router();
const db = require("../db");

// ======================
// Obtener todos los pedidos
// ======================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      o.*,
      c.name AS clientName,
      c.price_fardo,
      c.price_botellon,
      c.price_botellon_nuevo
    FROM orders o
    LEFT JOIN clients c ON o.clientId = c.id
    ORDER BY o.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("ERROR /api/orders:", err);
      return res.status(500).json({ error: "Error obteniendo pedidos" });
    }
    res.json(rows);
  });
});

// ======================
// Crear pedido
// ======================
router.post("/", (req, res) => {
  const { clientId, date, fardos, botellones_solicitados, notas } = req.body;

  db.run(
    `INSERT INTO orders (clientId, date, fardos, botellones_solicitados, estado, notas)
     VALUES (?, ?, ?, ?, 'pendiente', ?)`,
    [clientId, date, fardos, botellones_solicitados, notas],
    function (err) {
      if (err) {
        console.error("ERROR creando pedido:", err);
        return res.status(500).json({ error: "No se pudo crear el pedido" });
      }
      res.json({ id: this.lastID });
    }
  );
});

// ======================
// Marcar pedido como entregado
// ======================
router.put("/:id/entregar", (req, res) => {
  const id = req.params.id;
  const { botellones_recolectados = 0, entregados_llenos = 0 } = req.body;

  const fecha = new Date().toISOString().split("T")[0];

  // 1. Actualizar pedido
  const updateSQL = `
    UPDATE orders
    SET estado = 'entregado',
        botellones_recolectados = ?,
        entregados_llenos = ?
    WHERE id = ?
  `;

  db.run(updateSQL, [botellones_recolectados, entregados_llenos, id], function (err) {
    if (err) {
      console.error("❌ Error actualizando pedido:", err);
      return res.status(500).json({ error: "Error al entregar pedido" });
    }

    // Obtener clientId del pedido entregado
    db.get("SELECT clientId FROM orders WHERE id = ?", [id], (err, row) => {
      if (err || !row) {
        console.error("❌ No se pudo obtener clientId:", err);
        return res.status(500).json({ error: "Error interno" });
      }

      const clientId = row.clientId;

      // 2. Registrar entrega de botellones llenos
      if (entregados_llenos > 0) {
        db.run(
          `INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen)
           VALUES (?, 'entregado', ?, ?, 'entrega')`,
          [clientId, entregados_llenos, fecha]
        );
      }

      // 3. Registrar recolección de botellones vacíos
      if (botellones_recolectados > 0) {
        db.run(
          `INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen)
           VALUES (?, 'recolectado', ?, ?, 'entrega')`,
          [clientId, botellones_recolectados, fecha]
        );
      }

      res.json({ success: true });
    });
  });
});

// ======================
// Eliminar pedido
// ======================
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM orders WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error("ERROR al eliminar pedido:", err);
      return res.status(500).json({ error: "Error eliminando pedido" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
