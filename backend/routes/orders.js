const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener órdenes
router.get("/", (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT orders.*, clients.name AS clientName
      FROM orders
      LEFT JOIN clients ON clients.id = orders.clientId
      ORDER BY id DESC
    `).all();

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
});

// Crear orden
router.post("/", (req, res) => {
  const { clientId, date, fardos, botellones_solicitados, notas } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO orders (clientId, date, fardos, botellones_solicitados, notas)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(clientId, date, fardos, botellones_solicitados, notas);
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: "Error creando pedido" });
  }
});

// Entregar pedido
router.put("/:id/entregar", (req, res) => {
  const { id } = req.params;
  const { entregados_llenos, botellones_recolectados } = req.body;

  try {
    db.prepare(`
      UPDATE orders
      SET estado = 'entregado',
        entregados_llenos = ?,
        botellones_recolectados = ?
      WHERE id = ?
    `).run(entregados_llenos, botellones_recolectados, id);

    // Registrar movimientos
    const order = db.prepare("SELECT clientId FROM orders WHERE id = ?").get(id);

    if (entregados_llenos > 0) {
      db.prepare(`
        INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen)
        VALUES (?, 'entregado', ?, date('now'), 'entrega')
      `).run(order.clientId, entregados_llenos);
    }

    if (botellones_recolectados > 0) {
      db.prepare(`
        INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen)
        VALUES (?, 'recolectado', ?, date('now'), 'entrega')
      `).run(order.clientId, botellones_recolectados);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error entregando pedido" });
  }
});

// Borrar pedido
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM orders WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando pedido" });
  }
});

module.exports = router;
