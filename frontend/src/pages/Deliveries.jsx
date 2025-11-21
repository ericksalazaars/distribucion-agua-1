import React, { useEffect, useState } from "react";
import { entregarPedido, getPendingOrders } from "../api";

export default function Deliveries() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    entregados_llenos: "",
    botellones_recolectados: "",
  });

  // Cargar pedidos pendientes
  const load = () => {
    setLoading(true);
    getPendingOrders()
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando pedidos pendientes", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const submitDelivery = () => {
    if (!selected) return;

    entregarPedido(selected.id, {
      entregados_llenos: Number(form.entregados_llenos) || 0,
      botellones_recolectados: Number(form.botellones_recolectados) || 0,
    })
      .then(() => {
        setSelected(null);
        load();
      })
      .catch((err) => console.error("Error registrando entrega", err));
  };

  return (
    <div>
      <h2>Entregas pendientes</h2>

      {loading && <div className="muted">Cargando...</div>}

      {!loading && orders.length === 0 && (
        <div className="muted">No hay pedidos pendientes.</div>
      )}

      <div className="list-container" style={{ marginTop: 10 }}>
        {orders.map((order) => (
          <div className="list-card" key={order.id}>
            <strong>{order.clientName || "Cliente sin nombre"}</strong>
            <div className="muted">{order.date}</div>
            <div className="muted">Fardos: {order.fardos}</div>
            <div className="muted">
              Botellones solicitados: {order.botellones_solicitados}
            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: 10 }}
              onClick={() => {
                setSelected(order);
                setForm({
                  entregados_llenos: "",
                  botellones_recolectados: "",
                });
              }}
            >
              Registrar entrega
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Registrar entrega</h3>

            <label>Botellones entregados llenos</label>
            <input
              type="number"
              value={form.entregados_llenos}
              onChange={(e) =>
                setForm({
                  ...form,
                  entregados_llenos: e.target.value,
                })
              }
            />

            <label>Botellones recolectados vacíos</label>
            <input
              type="number"
              value={form.botellones_recolectados}
              onChange={(e) =>
                setForm({
                  ...form,
                  botellones_recolectados: e.target.value,
                })
              }
            />

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <button className="btn btn-primary" onClick={submitDelivery}>
                Guardar
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
