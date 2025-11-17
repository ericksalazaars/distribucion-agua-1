// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT o.*, c.name AS clientname, c.price_fardo, c.price_botellon, c.price_botellon_nuevo
      FROM orders o
      LEFT JOIN clients c ON o.clientId = c.id
      ORDER BY o.id DESC
    `;
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("ERROR /api/orders:", err);
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { clientId, date, fardos = 0, botellones_solicitados = 0, notas = "" } = req.body;
    const q = `
      INSERT INTO orders (clientId, date, fardos, botellones_solicitados, estado, notas)
      VALUES ($1,$2,$3,$4,'pendiente',$5) RETURNING *
    `;
    const { rows } = await db.query(q, [clientId, date, fardos, botellones_solicitados, notas]);
    res.json(rows[0]);
  } catch (err) {
    console.error("ERROR creando pedido:", err);
    res.status(500).json({ error: "No se pudo crear el pedido" });
  }
});

// PUT /api/orders/:id/entregar
router.put("/:id/entregar", async (req, res) => {
  try {
    const id = req.params.id;
    const { botellones_recolectados = 0, entregados_llenos = 0 } = req.body;
    const fecha = new Date().toISOString().split("T")[0];

    // actualizar pedido
    await db.query(
      `UPDATE orders SET estado='entregado', botellones_recolectados=$1, entregados_llenos=$2 WHERE id=$3`,
      [botellones_recolectados, entregados_llenos, id]
    );

    // obtener clientId
    const { rows } = await db.query("SELECT clientId FROM orders WHERE id = $1", [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Pedido no encontrado" });
    const clientId = rows[0].clientid || rows[0].clientId;

    // insertar movimientos
    if (entregados_llenos > 0) {
      await db.query(
        `INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen) VALUES ($1,'entregado',$2,$3,'entrega')`,
        [clientId, entregados_llenos, fecha]
      );
    }
    if (botellones_recolectados > 0) {
      await db.query(
        `INSERT INTO bottle_movements (clientId, tipo, cantidad, fecha, origen) VALUES ($1,'recolectado',$2,$3,'entrega')`,
        [clientId, botellones_recolectados, fecha]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ERROR entregando pedido:", err);
    res.status(500).json({ error: "Error al entregar el pedido" });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM orders WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("ERROR eliminando pedido:", err);
    res.status(500).json({ error: "Error eliminando pedido" });
  }
});

module.exports = router;
