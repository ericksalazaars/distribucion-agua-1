import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export default function Deliveries() {
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    entregados_llenos: "",
    botellones_recolectados: "",
  });

  function load() {
    api
      .get("/api/orders/pending")
      .then((res) => setPending(res.data || []))
      .catch((err) => console.error("Error cargando pendientes:", err));
  }

  useEffect(() => {
    load();
  }, []);

  function openDelivery(order) {
    setSelected(order);
    setForm({ entregados_llenos: "", botellones_recolectados: "" });
  }

  function submitDelivery() {
    if (!selected) return;

    api
      .put(`/api/orders/${selected.id}/entregar`, {
        entregados_llenos: Number(form.entregados_llenos) || 0,
        botellones_recolectados: Number(form.botellones_recolectados) || 0,
      })
      .then(() => {
        setSelected(null);
        load();
      })
      .catch((err) => console.error("Error guardando entrega:", err));
  }

  return (
    <div>
      <h2>Entregas pendientes</h2>

      {pending.length === 0 && (
        <div className="muted">No hay pedidos pendientes...</div>
      )}

      <div className="list-container">
        {pending.map((order) => (
          <div className="list-card" key={order.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{order.clientName || "Cliente sin nombre"}</strong>
                <div className="muted">{order.date}</div>
                <div className="muted">Fardos: {order.fardos}</div>
                <div className="muted">
                  Botellones solicitados: {order.botellones_solicitados}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => openDelivery(order)}
              >
                Entregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal entrega */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Registrar entrega</h3>

            <label>Botellones entregados llenos</label>
            <input
              type="number"
              value={form.entregados_llenos}
              onChange={(e) =>
                setForm({ ...form, entregados_llenos: e.target.value })
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

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={submitDelivery}>
                Guardar
              </button>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
