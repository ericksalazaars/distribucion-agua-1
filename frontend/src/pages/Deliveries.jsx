import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export default function Deliveries() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    api
      .get("/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("ERROR cargando pedidos:", err));
  }

  // Esta es la función correcta para entregar
  function updateDelivery(order, recolectados, entregadosLlenos) {
    api
      .put(`/api/orders/${order.id}/entregar`, {
        botellones_recolectados: Number(recolectados) || 0,
        entregados_llenos: Number(entregadosLlenos) || 0,
      })
      .then(() => {
        loadOrders();
      })
      .catch((err) => {
        console.error("ERROR al entregar:", err);
      });
  }

  const pendientes = orders.filter((o) => o.estado === "pendiente");
  const entregados = orders.filter((o) => o.estado === "entregado");

  return (
    <div className="page">
      <h2>Entregas</h2>

      <div className="card">
        <h3>Pendientes de entrega</h3>

        {pendientes.length === 0 && (
          <div className="muted">No hay pedidos pendientes.</div>
        )}

        <div className="list">
          {pendientes.map((order) => (
            <PendingOrder
              key={order.id}
              order={order}
              onDeliver={updateDelivery}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Últimas entregas</h3>

        {entregados.length === 0 && (
          <div className="muted">No hay entregas recientes.</div>
        )}

        <div className="list">
          {entregados.map((o) => (
            <div key={o.id} className="list-item">
              <div>
                <strong>{o.clientName}</strong>
                <div className="muted">Fardos: {o.fardos}</div>
                <div className="muted">
                  Botellones recolectados: {o.botellones_recolectados}
                </div>
                <div className="muted">
                  Entregados (llenos): {o.entregados_llenos}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PendingOrder({ order, onDeliver }) {
  const [recolectados, setRecolectados] = useState("");
  const [entregadosLlenos, setEntregadosLlenos] = useState("");

  return (
    <div className="list-item">
      <div>
        <strong>{order.clientName}</strong>
        <div className="muted">
          {order.date} — Fardos: {order.fardos}{" "}
          {order.botellones_solicitados
            ? `— Botellones solicitados: ${order.botellones_solicitados}`
            : ""}
        </div>
      </div>

      <div className="list-actions">
        <input
          type="number"
          placeholder="Bot. vacíos"
          value={recolectados}
          onChange={(e) => setRecolectados(e.target.value)}
          style={{
            width: "120px",
            padding: "6px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="number"
          placeholder="Llenos entregados"
          value={entregadosLlenos}
          onChange={(e) => setEntregadosLlenos(e.target.value)}
          style={{
            width: "140px",
            padding: "6px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginLeft: "8px",
          }}
        />

        <button
          className="btn-primary"
          onClick={() =>
            onDeliver(order, recolectados, entregadosLlenos)
          }
        >
          Entregar
        </button>
      </div>
    </div>
  );
}
